import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import Button from '../../buttons/LargeButton/Button.tsx'
import Icon from '../Icon/Icon.tsx'
import { Color, Layout, Size } from '../../../constants/enums.ts'
import { IconLink } from '../../../constants/IconLink.ts'
import { appStore, useAppStore } from '../../../store/useAppStore.ts'
import {
  isFirefoxBrowser,
  isMobileDevice,
  isPwaStandalone,
  setDeferredInstallPrompt,
  clearDeferredInstallPrompt,
  markPwaInstallBannerDismissed,
  markPwaInstalledInStorage,
  shouldShowPwaInstallBannerByStorage,
  type BeforeInstallPromptEvent,
} from '../../../utils/pwaInstall.ts'
import { isBannerDebugOverrideEnabled } from '../../../utils/bannerDebugOverride.ts'
import cl from './PwaInstallBanner.module.scss'

const LOGO_SRC = `${import.meta.env.BASE_URL}img/logo.png`

/**
 * Баннер установки PWA (внизу экрана, оформление как Toast). Виден только на слое плана.
 */
const PwaInstallBanner = () => {
  const [searchParams] = useSearchParams()
  const activeLayout = useAppStore((state) => state.activeLayout)
  const forceShowBanners = isBannerDebugOverrideEnabled(searchParams)
  const [storageOk, setStorageOk] = useState(() => shouldShowPwaInstallBannerByStorage())
  const [dismissed, setDismissed] = useState(false)
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)

  const dismiss = useCallback(() => {
    if (!forceShowBanners) {
      markPwaInstallBannerDismissed()
      setStorageOk(false)
    }
    setDismissed(true)
    deferredPrompt.current = null
    clearDeferredInstallPrompt()
  }, [forceShowBanners])

  const onInstallClick = useCallback(() => {
    appStore().changeLayout(Layout.PWA_INSTALL)
    dismiss()
  }, [dismiss])

  useEffect(() => {
    if (!forceShowBanners && !isMobileDevice()) return
    if (!forceShowBanners && isPwaStandalone()) {
      markPwaInstalledInStorage()
      setStorageOk(false)
      return
    }

    if (!('serviceWorker' in navigator)) return
    if (!forceShowBanners && isFirefoxBrowser()) return
    if (!forceShowBanners && !shouldShowPwaInstallBannerByStorage()) return

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      deferredPrompt.current = event as BeforeInstallPromptEvent
      setDeferredInstallPrompt(deferredPrompt.current)
      setStorageOk(shouldShowPwaInstallBannerByStorage())
    }

    const onInstalled = () => {
      markPwaInstalledInStorage()
      deferredPrompt.current = null
      clearDeferredInstallPrompt()
      setStorageOk(false)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [forceShowBanners])

  if (dismissed) return null
  if (!forceShowBanners) {
    if (activeLayout !== Layout.PLAN) return null
    if (!isMobileDevice()) return null
    if (isFirefoxBrowser()) return null
    if (!storageOk || isPwaStandalone()) return null
  }

  return (
    <div className={cl.banner} role='dialog' aria-label='Установка приложения'>
      <div className={cl.inner}>
        {/* <img className={cl.logo} src={LOGO_SRC} alt='' width={48} height={48} /> */}
        <div className={cl.content}>
          <div className={cl.titleRow}>
            <p className={cl.title}>Установите наше приложение</p>
            <button type='button' className={cl.close} onClick={dismiss} aria-label='Закрыть'>
              <Icon size={Size.S} iconLink={IconLink.CROSS} color={Color.C4} />
            </button>
          </div>
          <p className={cl.subtitle}>
            Так оно будет работать стабильнее, а вы будете всегда иметь быстрый доступ к навигации по кампусу
          </p>
          <div className={cl.actions}>
            <Button color={Color.BLUE} text='Установить' onClick={() => void onInstallClick()} size={Size.S} fullWidth />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PwaInstallBanner
