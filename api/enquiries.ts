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
 * Normalizes the configured Google Apps Script Web App URL.
 * Cleans whitespace, strips trailing slashes, and ensures the /exec endpoint is targeted.
 */
export function normalizeGoogleAppsScriptUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    if (!parsed.pathname.endsWith("/exec")) {
      parsed.pathname = `${parsed.pathname}/exec`;
    }
    return parsed.toString();
  } catch {
    const cleaned = trimmed.replace(/\/+$/, "");
    return cleaned.endsWith("/exec") ? cleaned : `${cleaned}/exec`;
  }
}

/**
 * Sanitizes URLs for diagnostic logs to prevent leaking secrets or session keys.
 */
function sanitizeUrlForDiagnostic(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.searchParams.delete("secret");
    url.searchParams.delete("sharedSecret");
    url.searchParams.delete("key");
    if (url.searchParams.has("user_content_key")) {
      url.searchParams.set("user_content_key", "[REDACTED]");
    }
    return url.toString();
  } catch {
    return "[invalid-url]";
  }
}

/**
 * Extracts non-sensitive status and structural fields for diagnostic logging.
 * Never logs parent enquiry information or secrets.
 */
function extractSafeDiagnosticBody(
  result: Record<string, unknown> | null,
): Record<string, unknown> | null {
  if (!result || typeof result !== "object") return null;
  return {
    success: typeof result.success === "boolean" ? result.success : undefined,
    status: typeof result.status === "string" ? result.status : undefined,
    service: typeof result.service === "string" ? result.service : undefined,
    hasEnquiryNumber: typeof result.enquiryNumber === "string",
    duplicate:
      typeof result.duplicate === "boolean" ? result.duplicate : undefined,
    emailSent:
      typeof result.emailSent === "boolean" ? result.emailSent : undefined,
    error: typeof result.error === "string" ? result.error : undefined,
    message: typeof result.message === "string" ? result.message : undefined,
  };
}

/**
 * Emits safe diagnostic logs for the Apps Script HTTP response.
 */
function logAppsScriptDiagnostic(params: {
  status: number;
  finalUrl: string;
  contentType: string | null;
  result: Record<string, unknown> | null;
}) {
  const safeLog = {
    httpStatus: params.status,
    finalUrl: sanitizeUrlForDiagnostic(params.finalUrl),
    contentType: params.contentType ?? "unknown",
    body: extractSafeDiagnosticBody(params.result),
  };
  console.info("apps_script_diagnostic:", JSON.stringify(safeLog));
}

/**
 * Sends validated enquiry data to the configured Google Apps Script Web App.
 * Robustly handles Google Apps Script 302/307 redirects:
 * - When redirected to script.googleusercontent.com (Google's echo server),
 *   fetches the doPost result via GET as required by Google ContentService.
 * - When redirected within script.google.com (canonical redirects),
 *   maintains POST with the JSON body so doPost receives the payload
 *   instead of falling through to doGet.
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
    const targetUrl = normalizeGoogleAppsScriptUrl(scriptUrl);
    let currentUrl = targetUrl;
    let method = "POST";
    let body: string | undefined = JSON.stringify(payload);
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    let response: Response | null = null;
    const maxRedirects = 5;
    let redirectCount = 0;

    while (redirectCount <= maxRedirects) {
      response = await fetch(currentUrl, {
        method,
        headers,
        body,
        redirect: "manual",
        signal: controller.signal,
      });

      // Handle HTTP redirects (301, 302, 303, 307, 308)
      if (
        [301, 302, 303, 307, 308].includes(response.status) &&
        response.headers.has("location")
      ) {
        const locationHeader = response.headers.get("location")!;
        const nextUrl = new URL(locationHeader, currentUrl).toString();
        redirectCount++;

        // If redirect points to Google's echo server (script.googleusercontent.com),
        // doPost has already completed and Google serves the output via GET.
        if (
          nextUrl.includes("script.googleusercontent.com") ||
          nextUrl.includes("googleusercontent.com") ||
          nextUrl.includes("/echo")
        ) {
          method = "GET";
          body = undefined;
          headers = {
            Accept: "application/json",
          };
        } else {
          // If redirecting within script.google.com (e.g. protocol or path canonicalization),
          // preserve POST and JSON payload so doPost actually executes instead of falling through to doGet.
          method = "POST";
          body = JSON.stringify(payload);
          headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
          };
        }

        currentUrl = nextUrl;
        continue;
      }

      break;
    }

    clearTimeout(timeoutId);

    if (!response) {
      throw new Error("APPS_SCRIPT_NO_RESPONSE");
    }

    const contentType = response.headers.get("content-type");
    const rawText = await response.text().catch(() => "");
    let result: Record<string, unknown> | null = null;
    try {
      result = rawText ? JSON.parse(rawText) : null;
    } catch {
      result = null;
    }

    // Safe diagnostic logging (NEVER logs secrets or parent info)
    logAppsScriptDiagnostic({
      status: response.status,
      finalUrl: currentUrl,
      contentType,
      result,
    });

    if (!response.ok && response.status !== 200 && response.status !== 201) {
      console.error("google_apps_script_http_error: " + response.status);
      throw new Error(`APPS_SCRIPT_HTTP_${response.status}`);
    }

    // Explicitly detect if the response was from doGet instead of doPost execution
    if (
      result &&
      result.status === "ok" &&
      result.service === "Rainbow Digi School Admissions Webhook"
    ) {
      console.error(
        "google_apps_script_received_doget_response: doPost did not execute; health response received.",
      );
      throw new Error("APPS_SCRIPT_RECEIVED_DOGET_RESPONSE");
    }

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
