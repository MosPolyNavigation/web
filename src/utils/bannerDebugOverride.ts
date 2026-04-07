const BANNER_DEBUG_QUERY_PARAM = 'showBanners'
const PLATFORM_DEBUG_QUERY_PARAM = 'debugPlatform'

export type DebugPlatformOverride = 'ios' | 'android' | 'desktop'

export function isBannerDebugOverrideEnabled(searchParams: URLSearchParams): boolean {
  if (!import.meta.env.DEV) {
    return false
  }

  const value = searchParams.get(BANNER_DEBUG_QUERY_PARAM)?.trim().toLowerCase()

  return value === '1' || value === 'true'
}

export function getPlatformDebugOverride(searchParams: URLSearchParams): DebugPlatformOverride | null {
  if (!import.meta.env.DEV) {
    return null
  }

  const value = searchParams.get(PLATFORM_DEBUG_QUERY_PARAM)?.trim().toLowerCase()

  if (value === 'ios' || value === 'android' || value === 'desktop') {
    return value
  }

  return null
}
