import React, { useMemo } from 'react'
import cl from './WayInfo.module.scss'
import WaySelectorButton from '../../../buttons/WaySelectorButton/WaySelectorButton.tsx'
import { IconLink } from '../../../../constants/IconLink.ts'
import { BtnName, Color, SearchIndent, Size } from '../../../../constants/enums.ts'
import Icon from '../../../common/Icon/Icon.tsx'
import { appStore, useAppStore } from '../../../../store/useAppStore.ts'
import { Pointer, QueryService } from '../../../../models/QueryService.ts'
import { useDataStore } from '../../../../store/useDataStore.ts'
import { RoomData } from '../../../../constants/types.ts'
import { Vertex } from '../../../../models/Graph.ts'

function WayInfo() {
  const queryService = useAppStore((state) => state.queryService)
  const rooms = useDataStore((state) => state.rooms)
  const roomFrom = useMemo(() => rooms.find((room) => room.id === queryService.from), [queryService, rooms])
  const roomTo = useMemo(() => rooms.find((room) => room.id === queryService.to), [queryService, rooms])

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

  if (!wayInfoData) return null

  //TODO: добавить "неизвестно" для помещений которых нет в таблице
  return (
    <div className={cl.wayInfoWrapper}>
      <div className={cl.wayInfoContent}>
        <WaySelectorButton
          text={roomFrom ? roomFrom.title : null}
          baseText={'Откуда'}
          icon={roomFrom ? roomFrom.icon : null}
          baseIcon={IconLink.FROM}
          onClick={() => {
            appStore().controlBtnClickHandler(BtnName.SEARCH)
            appStore().setSearchIndent(SearchIndent.SET_FROM)
          }}
          onCrossClick={() => appStore().setQueryService(new QueryService({ from: Pointer.NOTHING }))}
        />

        <button className={cl.swapButton} onClick={() => appStore().setQueryService(new QueryService({ swap: true }))}>
          <Icon iconLink={IconLink.SWAP} color={Color.C3} size={Size.M} />
        </button>

        <WaySelectorButton
          text={roomTo ? roomTo.title : null}
          baseText={'Откуда'}
          icon={roomTo ? roomTo.icon : null}
          baseIcon={IconLink.FROM}
          onClick={() => {
            appStore().controlBtnClickHandler(BtnName.SEARCH)
            appStore().setSearchIndent(SearchIndent.SET_TO)
          }}
          onCrossClick={() => appStore().setQueryService(new QueryService({ to: Pointer.NOTHING }))}
        />
      </div>

      <div className={cl.waySteps}>
        <ul className={cl.wayStepsList}>
          <li className={cl.wayStepsItem}>
            <Icon classNameExt={cl.wayStepsIcon} iconLink={wayInfoData.fromWay.fromIcon} color={Color.INITIAL} />
            <p className={cl.wayStepsText}>{wayInfoData.fromWay.text}</p>
          </li>
          {wayInfoData.steps.map((step, index) => (
            <li key={index} className={cl.wayStepsItem}>
              <Icon classNameExt={cl.wayStepsIcon} iconLink={step.stepIcon} color={Color.INITIAL} />
              <p className={cl.wayStepsText}>{step.stepText}</p>
            </li>
          ))}
          <li className={cl.wayStepsItem}>
            <Icon classNameExt={cl.wayStepsIcon} iconLink={wayInfoData.toWay.toIcon} color={Color.INITIAL} />
            <p className={cl.wayStepsText}>{wayInfoData.toWay.text}</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default WayInfo
