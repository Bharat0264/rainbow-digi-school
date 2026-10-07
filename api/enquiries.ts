import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const enquirySchema = z.object({
  parentName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[0-9+()\-\s]{7,24}$/, 'Enter a valid mobile number'),
  whatsapp: z.string().trim().regex(/^[0-9+()\-\s]{7,24}$/).optional().or(z.literal('')),
  email: z.string().trim().email().max(254).optional().or(z.literal('')),
  childName: z.string().trim().min(2).max(100),
  program: z.string().trim().min(2).max(80),
  visitDate: z.string().date().optional().or(z.literal('')),
  message: z.string().trim().max(1_000).optional().or(z.literal('')),
  website: z.string().max(0).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(160).optional(),
  utmContent: z.string().trim().max(160).optional(),
  utmTerm: z.string().trim().max(160).optional()
});

function isAllowedOrigin(origin: string | undefined) {
  if (!origin) return true;
  const configured = process.env.ALLOWED_ORIGINS?.split(',').map((value) => value.trim()).filter(Boolean) ?? [];
  return configured.length === 0 || configured.includes(origin);
}

function enquiryNumber() {
  const year = new Date().getUTCFullYear();
  const suffix = crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase();
  return `RDS-ENQ-${year}-${suffix}`;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Allow', 'POST, OPTIONS');
    return response.status(204).end();
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST, OPTIONS');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAllowedOrigin(request.headers.origin)) {
    return response.status(403).json({ error: 'This origin is not allowed to submit enquiries.' });
  }

  const parsed = enquirySchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(422).json({ error: 'Please review the form fields.', fields: parsed.error.flatten().fieldErrors });
  }

  if (parsed.data.website) {
    return response.status(202).json({ accepted: true });
  }

  try {
    const data = parsed.data;
    const enquiry = await prisma.enquiry.create({
      data: {
        enquiryNumber: enquiryNumber(),
        parentName: data.parentName,
        mobile: data.phone,
        whatsapp: data.whatsapp || null,
        email: data.email || null,
        childName: data.childName,
        interestedProgram: data.program,
        preferredVisitDate: data.visitDate ? new Date(`${data.visitDate}T00:00:00.000Z`) : null,
        message: data.message || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        utmContent: data.utmContent || null,
        utmTerm: data.utmTerm || null
      },
      select: { enquiryNumber: true }
    });
    return response.status(201).json({ enquiryNumber: enquiry.enquiryNumber });
  } catch (error) {
    console.error('admission_enquiry_create_failed', { error });
    return response.status(500).json({ error: 'We could not save your enquiry. Please try again shortly.' });
  }
}
