import { z } from 'zod'

export const InquirySchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(120).optional().default(''),
  industry: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().min(10).max(5_000),
}).strict()

export type Inquiry = z.infer<typeof InquirySchema>

export function parseInquiry(formData: FormData): Inquiry | null {
  const allowedKeys = new Set(['fullName', 'email', 'company', 'industry', 'message'])
  const entries = [...formData.entries()]

  if (
    entries.length > allowedKeys.size ||
    entries.some(([key]) => !allowedKeys.has(key)) ||
    new Set(entries.map(([key]) => key)).size !== entries.length
  ) return null

  const raw = Object.fromEntries(entries)
  if (Object.values(raw).some((value) => typeof value !== 'string' || value.length > 5_000)) {
    return null
  }

  const parsed = InquirySchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}

