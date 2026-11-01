type Failure = { success: false; error: string; requestId: string }

export async function withSafeErrorHandling<T>(
  operation: () => Promise<T>,
  requestId = crypto.randomUUID(),
): Promise<{ success: true; data: T } | Failure> {
  try {
    return { success: true, data: await operation() }
  } catch (error) {
    // Log a correlation ID and error class only. Do not log message contents,
    // email addresses, request bodies, provider credentials, or stack traces.
    console.error('contact_action_failed', {
      requestId,
      errorType: error instanceof Error ? error.name : 'UnknownError',
    })
    return {
      success: false,
      error: 'We could not process your inquiry right now. Please try again later.',
      requestId,
    }
  }
}

