import cl from './MainPage.module.scss'
import MiddleAndTopControlsLayer from '../../components/layouts/ControlsLayer/MiddleAndTopControlsLayer.tsx'
import LeftMenu from '../../components/layouts/LeftMenu/LeftMenu.tsx'
import { useEffect, useRef } from 'react'
import HomeLayer from '../../components/layouts/HomeLayer/HomeLayer.tsx'
import BottomLayer from '../../components/layouts/BottomLayer/BottomLayer.tsx'
import { Layout } from '../../constants/enums.ts'
import BottomControlsLayer from '../../components/layouts/BottomControlsLayer/BottomControlsLayer.tsx'
import { appStore } from '../../store/useAppStore.ts'
import PlanLayout from '../../components/layouts/Plan/PlanLayout.tsx'
import Toast from '../../components/common/Toast/Toast.tsx'
import PwaInstallBanner from '../../components/common/PwaInstallBanner/PwaInstallBanner.tsx'
import { appConfig } from '../../appConfig.ts'
import { userStore } from '../../store/useUserStore.ts'
import { statisticApi } from '../../api/statisticApi.ts'
import { useSearchParams } from 'react-router'

function MainPage() {
  const appRef = useRef<HTMLDivElement>(null)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    //Если пользователь не заходил на сайти или заходил больше 85 минут назад, показать начальный экран
    if (
      (!appConfig.firstPlanSettingDate || Date.now() - appConfig.firstPlanSettingDate > 85 * 60 * 1000) &&
      !searchParams.get(appConfig.roomSearchParamName) &&
      !searchParams.get(appConfig.fromSearchParamName) &&
      !searchParams.get(appConfig.toSearchParamName)
    ) {
      appStore().changeLayout(Layout.LOCATIONS)
    }
    // TODO: дать возможность уменьшать
    if (appRef.current)
      appRef.current.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault()
        }
      })
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!userStore().userId) {
        const userId = await statisticApi.getUserToken()
        userStore().setUserId(userId)
      }
      void statisticApi.sendSiteVisit()
    })()
  }, [])

  return (
    <div className={cl.app} ref={appRef}>
      <BottomControlsLayer />

      <MiddleAndTopControlsLayer />

      <LeftMenu />

      <HomeLayer />

      <BottomLayer />

      <PlanLayout />
      <Toast />
      <PwaInstallBanner />
    </div>
  )
}

export default MainPage
