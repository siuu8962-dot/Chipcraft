type Resolver = (result: string) => void

const pendingActions = new Map<string, Resolver>()

export function registerPendingAction(stepId: string, resolve: Resolver) {
  pendingActions.set(stepId, resolve)
}

export function resolvePendingAction(stepId: string, result: string) {
  const resolver = pendingActions.get(stepId)
  if (resolver) {
    resolver(result)
    pendingActions.delete(stepId)
    return true
  }
  return false
}

export async function waitForClientResult(stepId: string, timeoutMs = 30000): Promise<string> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      if (pendingActions.has(stepId)) {
        resolve("Error: Thao tác phía trình duyệt hết thời gian (30s)")
        pendingActions.delete(stepId)
      }
    }, timeoutMs)

    registerPendingAction(stepId, (result) => {
      clearTimeout(timeout)
      resolve(result)
    })
  })
}
