'use server'

import { parseInquiry } from './contact-validation'
import { consumeInquiryRateLimit } from './rate-limit'
import { withSafeErrorHandling } from './error-handler'

declare function getTrustedClientKey(): Promise<string>
declare function enqueueInquiry(input: {
  requestId: string
  inquiry: NonNullable<ReturnType<typeof parseInquiry>>
}): Promise<void>

type ActionResult =
  | { success: true }
  | { success: false; error: 'Please review the fields and try again.' | 'Please wait before sending another inquiry.' | 'We could not process your inquiry right now.' }

export async function submitInquiry(formData: FormData): Promise<ActionResult> {
  const inquiry = parseInquiry(formData)
  if (!inquiry) {
    return { success: false, error: 'Please review the fields and try again.' }
  }

  const requestId = crypto.randomUUID()
  const outcome = await withSafeErrorHandling(async () => {
    const clientKey = await getTrustedClientKey()
    const allowed = await consumeInquiryRateLimit(`inquiry:${clientKey}`)
    if (!allowed) return 'rate-limited' as const

    await enqueueInquiry({ requestId, inquiry })
    return 'queued' as const
  }, requestId)

  if (!outcome.success) {
    return { success: false, error: 'We could not process your inquiry right now.' }
  }
  if (outcome.data === 'rate-limited') {
    return { success: false, error: 'Please wait before sending another inquiry.' }
  }

  return { success: true }
}

