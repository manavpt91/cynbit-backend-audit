'use server'

import { parseInquiry } from './contact-validation'
import { consumeInquiryRateLimit } from './rate-limit'

declare function getTrustedClientKey(): Promise<string>
declare function enqueueInquiry(input: {
  requestId: string
  inquiry: NonNullable<ReturnType<typeof parseInquiry>>
}): Promise<void>

type ActionResult =
  | { success: true }
  | { success: false; error: 'Please review the fields and try again.' | 'Please wait before sending another inquiry.' }

export async function submitInquiry(formData: FormData): Promise<ActionResult> {
  const inquiry = parseInquiry(formData)
  if (!inquiry) {
    return { success: false, error: 'Please review the fields and try again.' }
  }

  const clientKey = await getTrustedClientKey()
  const allowed = await consumeInquiryRateLimit(`inquiry:${clientKey}`)
  if (!allowed) {
    return { success: false, error: 'Please wait before sending another inquiry.' }
  }

  const requestId = crypto.randomUUID()
  await enqueueInquiry({ requestId, inquiry })
  return { success: true }
}

