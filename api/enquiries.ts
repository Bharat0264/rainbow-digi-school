import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { z } from "zod";

const prisma = new PrismaClient();
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

export function isAllowedOrigin(origin: string | undefined) {
  if (!origin) return false;
  const configured =
    process.env.ALLOWED_ORIGINS?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];
  return configured.includes(origin);
}

type EnquiryInput = z.infer<typeof enquirySchema>;

async function saveEnquiry(data: EnquiryInput) {
  return prisma.enquiry.create({
    data: {
      enquiryNumber: `RDS-ENQ-${new Date().getUTCFullYear()}-${randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`,
      parentName: data.parentName,
      mobile: data.phone,
      email: data.email || null,
      // Existing schema requires a child name; public enquiries do not collect it.
      childName: "",
      interestedProgram: data.program,
      message: data.message || null,
      // Versioned consent to enquiry contact, recorded alongside createdAt.
      source: "WEBSITE_CONSENT_V1",
    },
    select: { enquiryNumber: true },
  });
}

// Dependency injection lets checks verify persistence failures without a real database.
export function createHandler(
  save: (
    data: EnquiryInput,
  ) => Promise<{ enquiryNumber: string }> = saveEnquiry,
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
      return response
        .status(403)
        .json({
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
      return response
        .status(413)
        .json({
          error: "The enquiry is too large. Please shorten your message.",
        });
    }
    const parsed = enquirySchema.safeParse(request.body);
    if (!parsed.success) {
      return response
        .status(422)
        .json({
          error: "Please review the form fields.",
          fields: parsed.error.flatten().fieldErrors,
        });
    }
    if (!process.env.DATABASE_URL) {
      return response
        .status(503)
        .json({
          error:
            "Online enquiries are temporarily unavailable. Your enquiry has not been saved. Please try again later.",
        });
    }
    try {
      const enquiry = await save(parsed.data);
      return response
        .status(201)
        .json({ enquiryNumber: enquiry.enquiryNumber });
    } catch {
      console.error("admission_enquiry_create_failed");
      return response
        .status(503)
        .json({
          error: "We could not save your enquiry. Please try again shortly.",
        });
    }
  };
}

export default createHandler();
