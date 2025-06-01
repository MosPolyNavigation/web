import cl from './MainLayout.module.scss'
import MiddleAndTopControlsLayer from '../../../components/layouts/ControlsLayer/MiddleAndTopControlsLayer.tsx'
import LeftMenu from '../../../components/layouts/LeftMenu/LeftMenu.tsx'
import { useEffect, useRef } from 'react'
import HomeLayer from '../../../components/layouts/HomeLayer/HomeLayer.tsx'
import BottomLayer from '../../../components/layouts/BottomLayer/BottomLayer.tsx'
import SpaceInfo from '../../../components/layouts/BottomLayer/SpaceInfo/SpaceInfo.tsx'
import { Layout } from '../../../constants/enums.ts'
import BottomControlsLayer from '../../../components/layouts/BottomControlsLayer/BottomControlsLayer.tsx'
import SearchMenu from '../../../components/layouts/BottomLayer/SearchMenu/SearchMenu.tsx'
import { useAppStore } from '../../../store/useAppStore.ts'
import { useDataStore } from '../../../store/useDataStore.ts'
import PlanLayout from '../../../components/layouts/Plan/PlanLayout.tsx'
import WayInfo from '../../../components/layouts/BottomLayer/WayInfo/WayInfo.tsx'
import { IconLink } from '../../../constants/IconLink.ts'
import Toast from '../../../components/common/Toast/Toast.tsx'
import { Outlet } from 'react-router-dom'
import ReportPage from '../../../pages/ReportPage/ReportPage.tsx'

function MainLayout() {
  const activeLayout = useAppStore((state) => state.activeLayout)
  const queryService = useAppStore((state) => state.queryService)
  const appRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    useDataStore.getState().fetchData()
  }, [])

  return (
    <div ref={appRef}>
      <BottomControlsLayer />
      <MiddleAndTopControlsLayer />
      <LeftMenu />
      <HomeLayer />
      <BottomLayer>
        {activeLayout === Layout.REPORT && <ReportPage />}
        {activeLayout === Layout.SEARCH && <SearchMenu />}
        {activeLayout !== Layout.SEARCH && queryService.steps === undefined && <SpaceInfo />}
        {activeLayout !== Layout.SEARCH && queryService.steps ? (
          <WayInfo
            fromWay={{
              fromIcon: IconLink.STUDY,
              text: 'Н 405 (Аудитория)',
            }}
            toWay={{
              toIcon: IconLink.STUDY,
              text: 'Н 519 (Аудитория)',
            }}
            steps={[
              {
                stepIcon: IconLink.STEP1,
                stepText: 'Дойти до лестницы, подняться на 5-й этаж',
              },
              {
                stepIcon: IconLink.STEP1,
                stepText: 'Дойти до аудитории',
              },
            ]}
          />
        ) : null}
        <Outlet />
      </BottomLayer>
      <PlanLayout />
      <Toast />
    </div>
  )
}

export default MainLayout
