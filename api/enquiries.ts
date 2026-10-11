import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "node:crypto";
import { z } from "zod";

const programs = [
  "Nursery",
  "LKG",
  "UKG",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
] as const;

export const enquirySchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(2, "Enter your name (at least 2 characters).")
    .max(100),
  phone: z
    .string()
    .trim()
    .max(24)
    .transform((value) => value.replace(/[\s()-]/g, ""))
    .refine(
      (value) => /^(?:\+91)?[6-9]\d{9}$/.test(value),
      "Enter a 10-digit Indian mobile number, optionally beginning with +91.",
    ),
  email: z
    .string()
    .trim()
    .max(254)
    .email("Enter a valid email address.")
    .or(z.literal(""))
    .optional(),
  program: z.enum(programs, {
    errorMap: () => ({ message: "Select a class from Nursery to Grade 5." }),
  }),
  message: z
    .string()
    .trim()
    .max(1000, "Keep your message within 1,000 characters.")
    .optional(),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Please agree to be contacted about this enquiry.",
    }),
  }),
  website: z.string().max(0).optional(),
});

export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  const configured =
    process.env.ALLOWED_ORIGINS?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];
  return configured.includes(origin);
}

export type EnquiryInput = z.infer<typeof enquirySchema>;

export interface EnquirySubmissionData {
  reference: string;
  parentName: string;
  phone: string;
  email?: string;
  program: string;
  message?: string;
  consent: boolean;
  submittedAt: string;
}

export interface EnquiryStorageResult {
  enquiryNumber: string;
  duplicate?: boolean;
  emailSent?: boolean;
}

export type EnquirySender = (
  data: EnquirySubmissionData,
) => Promise<EnquiryStorageResult>;

/**
 * Sends validated enquiry data to the configured Google Apps Script Web App.
 * Handles redirects and network timeouts safely.
 */
export async function saveToGoogleAppsScript(
  data: EnquirySubmissionData,
): Promise<EnquiryStorageResult> {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const scriptSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;

  if (!scriptUrl || !scriptSecret) {
    throw new Error("GOOGLE_APPS_SCRIPT_CONFIG_MISSING");
  }

  const payload = {
    secret: scriptSecret,
    reference: data.reference,
    submittedAt: data.submittedAt,
    parentName: data.parentName,
    phone: data.phone,
    email: data.email || "",
    program: data.program,
    message: data.message || "",
    consent: data.consent,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok && response.status !== 200 && response.status !== 201) {
      await response.text().catch(() => "");
      console.error("google_apps_script_http_error: " + response.status);
      throw new Error(`APPS_SCRIPT_HTTP_${response.status}`);
    }

    const result = await response.json().catch(() => null);

    if (
      result &&
      result.success === true &&
      typeof result.enquiryNumber === "string" &&
      result.enquiryNumber === data.reference
    ) {
      return {
        enquiryNumber: result.enquiryNumber,
        duplicate: Boolean(result.duplicate),
        emailSent: Boolean(result.emailSent),
      };
    }

    console.error("google_apps_script_invalid_response");
    throw new Error("APPS_SCRIPT_INVALID_RESPONSE");
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        console.error("google_apps_script_timeout");
        throw new Error("APPS_SCRIPT_TIMEOUT");
      }
      throw err;
    }
    throw new Error("APPS_SCRIPT_NETWORK_ERROR");
  }
}

/**
 * Factory for creating the Vercel API enquiry handler.
 * Accepts an optional sender implementation for dependency injection in tests.
 */
export function createHandler(
  sender: EnquirySender = saveToGoogleAppsScript,
) {
  return async function handler(
    request: VercelRequest,
    response: VercelResponse,
  ) {
    response.setHeader("Cache-Control", "no-store");

    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      return response.status(405).json({ error: "Method not allowed" });
    }

    if (!isAllowedOrigin(request.headers.origin)) {
      return response.status(403).json({
        error:
          "Enquiries are unavailable from this address. Please try the school website.",
      });
    }

    if (
      !request.headers["content-type"]
        ?.toLowerCase()
        .startsWith("application/json")
    ) {
      return response
        .status(415)
        .json({ error: "Please submit the enquiry form as JSON." });
    }

    if (
      Number(request.headers["content-length"] ?? 0) > 12000 ||
      Buffer.byteLength(JSON.stringify(request.body ?? {}), "utf8") > 12000
    ) {
      return response.status(413).json({
        error: "The enquiry is too large. Please shorten your message.",
      });
    }

    const parsed = enquirySchema.safeParse(request.body);
    if (!parsed.success) {
      return response.status(422).json({
        error: "Please review the form fields.",
        fields: parsed.error.flatten().fieldErrors,
      });
    }

    // Ensure environment is configured before generating references
    if (
      !process.env.GOOGLE_APPS_SCRIPT_URL ||
      !process.env.GOOGLE_APPS_SCRIPT_SECRET
    ) {
      return response.status(503).json({
        error:
          "Online enquiries are temporarily unavailable. Your enquiry has not been saved. Please try again later.",
      });
    }

    const reference = `RDS-ENQ-${new Date().getUTCFullYear()}-${randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`;

    const submissionData: EnquirySubmissionData = {
      reference,
      parentName: parsed.data.parentName,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      program: parsed.data.program,
      message: parsed.data.message || undefined,
      consent: true,
      submittedAt: new Date().toISOString(),
    };

    try {
      const saved = await sender(submissionData);
      return response
        .status(201)
        .json({ enquiryNumber: saved.enquiryNumber });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "APPS_SCRIPT_TIMEOUT") {
        return response.status(504).json({
          error:
            "We could not confirm whether your enquiry was saved due to a network timeout. Check your connection or contact the school directly.",
        });
      }

      console.error("admission_enquiry_storage_failed");
      return response.status(503).json({
        error:
          "We could not save your enquiry. Please try again shortly or contact the admissions desk directly.",
      });
    }
  };
}

export default createHandler();
