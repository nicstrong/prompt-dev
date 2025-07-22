export type RequestEnricher = undefined | ((req: RequestInit) => Promise<void>)

export class HttpError extends Error {
  public readonly status: number
  public readonly statusText: string
  public readonly body: string | null

  constructor(status: number, statusText: string, body: string | null) {
    super(`${status} ${statusText}`)

    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
    this.body = body

    Object.setPrototypeOf(this, HttpError.prototype)
  }
}

export async function withEnricher(
  enricher: RequestEnricher,
  init: RequestInit = {},
) {
  await enricher?.(init)
  return init
}

export function createBearerTokenEnricher(
  getToken: () => Promise<string>,
): NonNullable<RequestEnricher> {
  return async (init) => {
    if (!(init.headers instanceof Headers)) {
      init.headers = new Headers(init.headers)
    }
    init.headers.append('Authorization', 'Bearer ' + (await getToken()))
  }
}

export async function ensureSuccess(resp: Response) {
  if (!resp.ok) {
    let body = null

    try {
      body = await resp.text()
    } catch (e) {}

    throw new HttpError(resp.status, resp.statusText, body)
  }
}
