export type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt: () => Promise<void>
}

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null

/** JSON в localStorage: `{ "installed": true }` или `{ "lastPromptAt": number }` */
export const PWA_INSTALLED_STORAGE_KEY = 'isPWAInstalled'

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000

export type PwaInstallStored = { installed: true } | { lastPromptAt: number }

export function parsePwaInstallStored(): PwaInstallStored | null {
  try {
    const raw = localStorage.getItem(PWA_INSTALLED_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (parsed && typeof parsed === 'object') {
      if (parsed.installed === true) return { installed: true }
      if (typeof parsed.lastPromptAt === 'number' && !Number.isNaN(parsed.lastPromptAt)) {
        return { lastPromptAt: parsed.lastPromptAt }
      }
    }
    return null
  } catch {
    return null
  }
}

export function isPwaStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const byDisplay =
    window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches
  const nav = window.navigator as Navigator & { standalone?: boolean }
  const byIOS = nav.standalone === true
  return byDisplay || byIOS
}

export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua)) return true
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}

export function isAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  return /android/i.test(navigator.userAgent)
}

export function isFirefoxBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  return /firefox/i.test(navigator.userAgent)
}

export function isMobileDevice(): boolean {
  return true
  // if (typeof navigator === 'undefined') return true
  // return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent)
}

/** Показать баннер: в режиме браузера и нет записи об установке; при повторе — только через 2 суток после lastPromptAt */
export function shouldShowPwaInstallBannerByStorage(): boolean {
  if (isPwaStandalone()) return false
  if (!isMobileDevice()) return false
  if (isFirefoxBrowser()) return false
  const s = parsePwaInstallStored()
  if (s === null) return true
  if ('installed' in s && s.installed) return false
  if ('lastPromptAt' in s) return Date.now() - s.lastPromptAt > TWO_DAYS_MS
  return true
}

export function markPwaInstallBannerDismissed(): void {
  try {
    localStorage.setItem(PWA_INSTALLED_STORAGE_KEY, JSON.stringify({ lastPromptAt: Date.now() }))
  } catch {
    /* ignore */
  }
}

export function markPwaInstalledInStorage(): void {
  try {
    localStorage.setItem(PWA_INSTALLED_STORAGE_KEY, JSON.stringify({ installed: true }))
  } catch {
    /* ignore */
  }
}

export function setDeferredInstallPrompt(event: BeforeInstallPromptEvent | null): void {
  deferredInstallPrompt = event
}

export function getDeferredInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredInstallPrompt
}

export function clearDeferredInstallPrompt(): void {
  deferredInstallPrompt = null
}
