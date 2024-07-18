export function jsonToUrlParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value)
  })
  return searchParams.toString()
}
