// Reference pattern for a public contact Server Action.
// Replace the injected services below with reviewed, production implementations.
'use server'

import { z } from 'zod'

const InquirySchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(120).optional().default(''),
  industry: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().min(10).max(5_000),
}).strict()

type Inquiry = z.infer<typeof InquirySchema>

type ActionResult =
  | { success: true }
  | { success: false; error: 'Please review the fields and try again.' | 'Please wait before sending another inquiry.' }

// These services are intentionally abstract. The production implementations
// must trust only proxy headers configured by the deployment provider, use a
// shared rate-limit store, and enqueue delivery with bounded retries.
declare function getTrustedClientKey(): Promise<string>
declare function consumeInquiryRateLimit(key: string): Promise<boolean>
declare function enqueueInquiry(inquiry: Inquiry): Promise<void>

export async function submitInquiry(formData: FormData): Promise<ActionResult> {
  const allowedKeys = new Set(['fullName', 'email', 'company', 'industry', 'message'])
  const entries = [...formData.entries()]

  // Bound count and value sizes before schema validation or downstream work.
  if (
    entries.length > allowedKeys.size ||
    entries.some(([key]) => !allowedKeys.has(key)) ||
    new Set(entries.map(([key]) => key)).size !== entries.length
  ) {
    return { success: false, error: 'Please review the fields and try again.' }
  }

  const raw: Record<string, unknown> = Object.fromEntries(entries)
  if (Object.values(raw).some((value) => typeof value !== 'string' || value.length > 5_000)) {
    return { success: false, error: 'Please review the fields and try again.' }
  }

  const parsed = InquirySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: 'Please review the fields and try again.' }
  }

  const clientKey = await getTrustedClientKey()
  const withinLimit = await consumeInquiryRateLimit(`inquiry:${clientKey}`)
  if (!withinLimit) {
    return { success: false, error: 'Please wait before sending another inquiry.' }
  }

  // Store and deliver plain text. Escape/encode it for the output context when
  // rendering it later; do not log the message or full email address.
  await enqueueInquiry(parsed.data)
  return { success: true }
}

