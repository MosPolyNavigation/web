import cl from './MainPage.module.scss'
import MiddleAndTopControlsLayer from '../../components/layouts/ControlsLayer/MiddleAndTopControlsLayer.tsx'
import LeftMenu from '../../components/layouts/LeftMenu/LeftMenu.tsx'
import { useEffect, useMemo, useRef } from 'react'
import HomeLayer from '../../components/layouts/HomeLayer/HomeLayer.tsx'
import BottomLayer from '../../components/layouts/BottomLayer/BottomLayer.tsx'
import SpaceInfo from '../../components/layouts/BottomLayer/SpaceInfo/SpaceInfo.tsx'
import { Layout } from '../../constants/enums.ts'
import BottomControlsLayer from '../../components/layouts/BottomControlsLayer/BottomControlsLayer.tsx'
import SearchMenu from '../../components/layouts/BottomLayer/SearchMenu/SearchMenu.tsx'
import { appStore, useAppStore } from '../../store/useAppStore.ts'
import { useDataStore } from '../../store/useDataStore.ts'
import PlanLayout from '../../components/layouts/Plan/PlanLayout.tsx'
import WayInfo from '../../components/layouts/BottomLayer/WayInfo/WayInfo.tsx'
import { IconLink } from '../../constants/IconLink.ts'
import Toast from '../../components/common/Toast/Toast.tsx'
import { appConfig } from '../../appConfig.ts'
import { userStore } from '../../store/useUserStore.ts'
import { statisticApi } from '../../api/statisticApi.ts'
import { useSearchParams } from 'react-router'
import { Vertex } from '../../models/Graph.ts'
import { RoomData } from '../../constants/types.ts'

function MainPage() {
  const activeLayout = useAppStore((state) => state.activeLayout)
  const queryService = useAppStore((state) => state.queryService)
  const rooms = useDataStore((state) => state.rooms)
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

  const wayInfoData = useMemo(() => {
    const steps = queryService.steps
    const fromRoom = rooms.find((room) => room.id === queryService.from)
    const toRoom = rooms.find((room) => room.id === queryService.to)

    if (!steps || !fromRoom || !toRoom) {
      return null
    }

    const getShortName = (room: RoomData) => {
      const parts = room.title.split(' — ')
      const base = parts[0] ?? room.title
      return base.length > 40 ? `${base.slice(0, 37)}…` : base
    }

    const uiSteps = steps.map((step, idx) => {
      const nextStep = steps[idx + 1]
      const lastVertex = step.way.at(-1)
      const lastRoom = rooms.find((room) => room.id === lastVertex?.id)

      const hasStair = step.way.some((v: Vertex) => v.type === 'stair')
      let text: string

      if (nextStep && (hasStair || nextStep.plan !== step.plan)) {
        const sameCorpus = nextStep.plan.corpus === step.plan.corpus
        const hasCrossing = step.way.some((v: Vertex) => v.type === 'crossing' || v.type === 'crossingSpace')

        if (sameCorpus) {
          if (nextStep.plan.floor > step.plan.floor) {
            text = `Дойти до лестницы, подняться на ${nextStep.plan.floor}-й этаж`
          } else if (nextStep.plan.floor < step.plan.floor) {
            text = `Дойти до лестницы, спуститься на ${nextStep.plan.floor}-й этаж`
          } else {
            text = `Дойти до лестницы, перейти на ${nextStep.plan.floor}-й этаж`
          }
        } else {
          text = hasCrossing
            ? `Дойти до перехода, перейти в корпус ${nextStep.plan.corpus.title}`
            : `Дойти до лестницы, перейти в корпус ${nextStep.plan.corpus.title}`
        }
      } else {
        const targetName = lastRoom ? getShortName(lastRoom) : `точки ${lastVertex?.id ?? idx + 1}`
        text = `Дойти до ${targetName}`
      }

      return {
        stepIcon: IconLink.STEP1,
        stepText: text,
      }
    })

    return {
      // Для начала и конца оставляем полное название, визуально ограничивается line-clamp в UI
      fromWay: { fromIcon: fromRoom.icon ?? IconLink.FROM, text: fromRoom.title },
      toWay: { toIcon: toRoom.icon ?? IconLink.TO, text: toRoom.title },
      steps: uiSteps,
    }
  }, [queryService.from, queryService.steps, queryService.to, rooms])

  return (
    <div className={cl.app} ref={appRef}>
      <BottomControlsLayer />

      <MiddleAndTopControlsLayer />

      <LeftMenu />

      <HomeLayer />

      <BottomLayer>
        {activeLayout === Layout.SEARCH && <SearchMenu />}
        {/*TODO: По идее надо добавить в стор сосотояния для открытого SpaceInfo и WayInfo чтобы вот так костыльно не делать*/}
        {activeLayout !== Layout.SEARCH && queryService.steps === undefined && <SpaceInfo />}
        {activeLayout !== Layout.SEARCH && wayInfoData ? (
          <WayInfo fromWay={wayInfoData.fromWay} toWay={wayInfoData.toWay} steps={wayInfoData.steps} />
        ) : null}
      </BottomLayer>

      <PlanLayout />
      <Toast />
      {/*<div style={{position: "absolute", inset: 0, width: '100%', height: '100%', backgroundColor: "white", zIndex: 2}}>*/}
      {/*	*/}
      {/*	<h1>asl;dkj</h1>*/}
      {/*</div>*/}
      <Toast />
    </div>
  )
}

export default MainPage
