const BANNER_DEBUG_QUERY_PARAM = 'showBanners'

export function isBannerDebugOverrideEnabled(searchParams: URLSearchParams): boolean {
  if (!import.meta.env.DEV) {
    return false
  }

  const value = searchParams.get(BANNER_DEBUG_QUERY_PARAM)?.trim().toLowerCase()

  return value === '1' || value === 'true'
}
