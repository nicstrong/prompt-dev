export type ApiOptions = {
  baseUrl: string
  getToken?: () => Promise<string>
  getHeaders?: () => Promise<Record<string, string>>
}
