import { FC, useEffect, useMemo, useRef, useState } from 'react'
import cl from './PlanLayout.module.scss'
import { appStore, useAppStore } from '../../../store/useAppStore.ts'
import { appConfig } from '../../../appConfig.ts'
import axios from 'axios'
import classNames from 'classnames'
import { RoomModel } from '../../../constants/types.ts'
import { getSvgLink } from '../../../functions/planFunctions.ts'
import { ReactZoomPanPinchContentRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { PlanModel } from '../../../models/Plan/PlanModel.ts'
import { userStore } from '../../../store/useUserStore.ts'
import { statisticApi } from '../../../api/statisticApi.ts'
import { dataStore } from '../../../store/useDataStore.ts'
import chalk from 'chalk'

const PlanLayout: FC = () => {
  const planSvgRef = useRef<null | SVGSVGElement>(null)
  const currentPlan = useAppStore((state) => state.currentPlan)
  const planModel = useAppStore((state) => state.planModel)
  const query = useAppStore((state) => state.queryService)
  const transformWrapperRef = useRef<ReactZoomPanPinchContentRef>(null)

  const svgLink = useMemo<string | null>(() => {
    if (currentPlan) return appConfig.svgSource + currentPlan?.wayToSvg
    return null
  }, [currentPlan])

  async function roomClickHandler(room: RoomModel) {
    //Если аудитории нет в таблице помещений, то она не выделяется (кроме режима разработчика)
    if (!dataStore().rooms.find((roomInfo) => roomInfo.id === room.roomId)) {
      appStore().toast.showForTime('К сожалению, мы пока не знаем, что здесь. Уже работаем над этим')
      if (userStore().isDevelopMode) {
        console.log(chalk.red(`Помещения с id ${chalk.underline(room.roomId)} нет в таблице помещений`))
      } else {
        return
      }
    }
    //Если есть активный маршрут, аудитория не выделяется
    if (appStore().queryService.steps) {
      return
    }
    if (appStore().selectedRoomId !== room.roomId) {
      appStore().changeSelectedRoom(room.roomId)
    } else {
      appStore().changeSelectedRoom(null)
    }
  }

  useEffect(() => {
    if (currentPlan) {
      axios.get(getSvgLink(currentPlan)).then((response) => {
        if (!planSvgRef.current) return //Если вдруг нет свгшки на странице, пропустить
        // Парсинг полученного текста свг=изображения в виртуальный ДОМ-элемент
        const parsedSvgDomEl = new DOMParser().parseFromString(response.data, 'image/svg+xml').documentElement as
          | SVGSVGElement
          | HTMLElement
        appStore().changePlanModel(currentPlan, planSvgRef.current, parsedSvgDomEl, roomClickHandler) //Установка новой модели-плана в стор приложения
        //Сохранение текущего плана в LocalStorage
        localStorage.setItem('last-plan', currentPlan.id)
        localStorage.setItem('last-plan-setting-date', String(Date.now()))
        if (transformWrapperRef.current) transformWrapperRef.current.resetTransform(1)
        // setTimeout(() => {
        // }, 1000)
      })
    }
  }, [currentPlan])

  const viewBox = useMemo(() => {
    if (planModel) {
      return planModel.planSvgEl.getAttribute('viewBox') ?? '0 0 0 0'
    } else {
      return '0 0 0 0'
    }
  }, [planModel])

  const endArrowAnimationEl = useRef<null | SVGAnimateElement>(null)

  const [wayAnimationClass, setWayAnimationClass] = useState(cl.wayAnimation)
  const { primaryWayPathD, primaryWayLength } = useMemo(() => {
    if (!query.steps || !(typeof query.currentStepIndex === 'number') || !planModel) {
      return { primaryWayPathD: '', primaryWayLength: 0 }
    }
    const steps = query.steps
    const currentStepIndex = query.currentStepIndex
    if (steps && steps[currentStepIndex].plan === planModel.plan) {
      const currentStep = steps[currentStepIndex]
      if (currentStep.plan === currentPlan) {
        planModel.highlightRoomForNextStep(
          planModel.rooms.get(currentStep.way.at(-1)?.id ?? ''),
          !(query.steps.length > currentStepIndex + 1)
        ) //Добавление новых хайлайтов на конечное на текущем плане помещение и слушателей кликап на смену плана на следующий в маршруте

        const vertexesOfWay = currentStep.way
        setWayAnimationClass('')
        setTimeout(() => {
          if (endArrowAnimationEl.current) endArrowAnimationEl.current.beginElement()
        }, 850)
        return {
          primaryWayPathD: generatePathD(vertexesOfWay),
          primaryWayLength: currentStep.distance,
        }
      }
    }
    return {
      primaryWayPathD: '',
      primaryWayLength: 0,
    }
  }, [planModel, query])

  useEffect(() => {
    if (wayAnimationClass === '') {
      setWayAnimationClass(cl.wayAnimation)
    }
  }, [wayAnimationClass])

  useEffect(() => {
    if (transformWrapperRef.current) {
      appStore().setControlsFunctions({
        zoomIn: transformWrapperRef.current.zoomIn,
        zoomOut: transformWrapperRef.current.zoomOut,
      })
    }
  }, [transformWrapperRef])

  return (
    <div className={cl.planWrapper}>
      <TransformWrapper ref={transformWrapperRef} maxScale={5} disablePadding={true}>
        <TransformComponent wrapperClass={cl.transformWrapper}>
          {svgLink && (
            <div className={cl.planWrapperInner}>
              <svg className={cl.planSvg} ref={planSvgRef}></svg>
              <svg className={cl.planAddingObjects} viewBox={viewBox}>
                {primaryWayPathD && (
                  <path
                    d={primaryWayPathD}
                    className={classNames(cl.way, wayAnimationClass)}
                    style={{ strokeDasharray: primaryWayLength, strokeDashoffset: primaryWayLength }}
                    markerStart="url(#way-start-circle)"
                    markerEnd="url(#way-end-arrow)"
                  />
                )}
                <defs>
                  <marker
                    id="way-end-arrow"
                    markerUnits="userSpaceOnUse"
                    markerWidth="20"
                    markerHeight="22"
                    refX="15"
                    refY="11"
                    viewBox="0 0 20 22"
                    fill="none"
                    orient="auto-start-reverse"
                  >
                    <path key={primaryWayPathD} className={classNames(cl.endArrow, wayAnimationClass)}></path>
                  </marker>
                  <marker
                    id="way-start-circle"
                    markerUnits="userSpaceOnUse"
                    markerWidth="20"
                    markerHeight="20"
                    refX="10"
                    refY="10"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle fill="white" cx="10" cy="10" className={classNames(cl.startCircle, wayAnimationClass)} />
                  </marker>
                </defs>
              </svg>
            </div>
          )}
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default PlanLayout

function generatePathD(points: Point[]) {
  if (!points || points.length === 0) {
    return ''
  }

  let d = `M ${points[0].x} ${points[0].y}`

  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`
  }

  return d
}

type Point = {
  x: number
  y: number
}
