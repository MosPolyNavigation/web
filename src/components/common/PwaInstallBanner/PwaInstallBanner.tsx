import { useCallback, useEffect, useRef, useState } from 'react'
import Button from '../../buttons/LargeButton/Button.tsx'
import Icon from '../Icon/Icon.tsx'
import { Color, Layout, Size } from '../../../constants/enums.ts'
import { IconLink } from '../../../constants/IconLink.ts'
import { useAppStore } from '../../../store/useAppStore.ts'
import {
  isFirefoxBrowser,
  isMobileDevice,
  isIOSDevice,
  isPwaStandalone,
  markPwaInstallBannerDismissed,
  markPwaInstalledInStorage,
  shouldShowPwaInstallBannerByStorage,
  type BeforeInstallPromptEvent,
} from '../../../utils/pwaInstall.ts'
import cl from './PwaInstallBanner.module.scss'

const LOGO_SRC = `${import.meta.env.BASE_URL}img/logo.png`

/**
 * Баннер установки PWA (внизу экрана, оформление как Toast). Виден только на слое плана.
 */
const PwaInstallBanner = () => {
  const activeLayout = useAppStore((state) => state.activeLayout)
  const [storageOk, setStorageOk] = useState(() => shouldShowPwaInstallBannerByStorage())
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  // нажали установить в сафари, покажем подсказку
  const [iosHint, setIosHint] = useState(false)

  const dismiss = useCallback(() => {
    markPwaInstallBannerDismissed()
    setStorageOk(false)
    deferredPrompt.current = null
    setIosHint(false)
  }, [])

  const onInstallClick = useCallback(async () => {
    const e = deferredPrompt.current
    if (e) {
      try {
        await e.prompt()
        await e.userChoice
      } finally {
        deferredPrompt.current = null
      }
      return
    }
    if (isIOSDevice()) {
      setIosHint(true)
      return
    }
  }, [])

  useEffect(() => {
    if (!isMobileDevice()) return
    if (isPwaStandalone()) {
      markPwaInstalledInStorage()
      setStorageOk(false)
      return
    }

    if (!('serviceWorker' in navigator)) return
    if (isFirefoxBrowser()) return
    if (!shouldShowPwaInstallBannerByStorage()) return

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      deferredPrompt.current = event as BeforeInstallPromptEvent
      setStorageOk(shouldShowPwaInstallBannerByStorage())
    }

    const onInstalled = () => {
      markPwaInstalledInStorage()
      deferredPrompt.current = null
      setStorageOk(false)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (activeLayout !== Layout.PLAN) return null
  if (!isMobileDevice()) return null
  if (isFirefoxBrowser()) return null
  if (!storageOk || isPwaStandalone()) return null

  return (
    <div className={cl.banner} role='dialog' aria-label='Установка приложения'>
      <div className={cl.inner}>
        {/* <img className={cl.logo} src={LOGO_SRC} alt='' width={48} height={48} /> */}
        <div className={cl.content}>
          <div className={cl.titleRow}>
            {!iosHint && <p className={cl.title}>Установите наше приложение</p>}
            {iosHint && (
              <p className={cl.iosHint}>
                Отлично!
                <br /> Нажмите <b>"Поделиться"</b> внизу экрана, затем <b>"На экран Домой"</b>.
              </p>
            )}
            <button type='button' className={cl.close} onClick={dismiss} aria-label='Закрыть'>
              <Icon size={Size.S} iconLink={IconLink.CROSS} color={Color.C4} />
            </button>
          </div>
          {!iosHint && (
            <>
              {' '}
              <p className={cl.subtitle}>
                Так оно будет работать стабильнее, а вы будете всегда иметь быстрый доступ к навигации по кампусу
              </p>
              <div className={cl.actions}>
                <Button
                  color={Color.BLUE}
                  text='Установить'
                  onClick={() => void onInstallClick()}
                  size={Size.S}
                  fullWidth
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PwaInstallBanner
