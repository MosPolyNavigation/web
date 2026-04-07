import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { isAndroidDevice, isIOSDevice } from '../../../../utils/pwaInstall.ts'
import { getPlatformDebugOverride } from '../../../../utils/bannerDebugOverride.ts'
import cl from './PwaInstallSheet.module.scss'

const PwaInstallSheet = () => {
  const [searchParams] = useSearchParams()
  const platformOverride = getPlatformDebugOverride(searchParams)
  const isIOS = platformOverride ? platformOverride === 'ios' : isIOSDevice()
  const isAndroid = platformOverride ? platformOverride === 'android' : isAndroidDevice()

  const platformLabel = useMemo(() => {
    if (isIOS) {
      return 'iPhone / iPad'
    }
    if (isAndroid) {
      return 'Android'
    }
    return 'Браузер на компьютере'
  }, [isAndroid, isIOS])

  return (
    <div className={cl.pwaInstallSheet}>
      <div className={cl.header}>
        <div className={cl.title}>Установите наше приложение</div>
        <div className={cl.subtitle}>
          Так оно будет работать стабильнее, а вы будете всегда иметь быстрый доступ к навигации по кампусу.
        </div>
      </div>

      <div className={cl.platformBadge}>{platformLabel}</div>

      {isIOS ? (
        <div className={cl.instructions}>
          <div className={cl.instructionsTitle}>Как установить на iOS</div>
          <ol className={cl.list}>
            <li>Нажмите кнопку «Поделиться» в браузере Safari.</li>
            <li>Выберите пункт «Добавить на экран Домой».</li>
            <li>Подтвердите добавление приложения.</li>
          </ol>
        </div>
      ) : (
        <div className={cl.instructions}>
          <div className={cl.instructionsTitle}>Как установить</div>
          <ol className={cl.list}>
            <li>Нажмите кнопку ниже и подтвердите установку, если браузер покажет системное окно.</li>
            <li>Если окно не появилось, откройте меню браузера.</li>
            <li>Выберите пункт «Установить приложение», «Install app» или похожий по смыслу.</li>
          </ol>
        </div>
      )}
    </div>
  )
}

export default PwaInstallSheet
