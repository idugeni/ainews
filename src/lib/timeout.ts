export class TimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TimeoutError"
  }
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = "Operation timed out",
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new TimeoutError(errorMessage))
    }, timeoutMs)

    promise
      .then((result) => {
        clearTimeout(timeoutId)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        reject(error)
      })
  })
}

export const DEFAULT_TIMEOUT_MS = 60000 // 60 seconds
