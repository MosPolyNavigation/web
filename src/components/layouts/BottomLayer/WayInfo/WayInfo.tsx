import React, { useMemo } from 'react'
import cl from './WayInfo.module.scss'
import WaySelectorButton from '../../../buttons/WaySelectorButton/WaySelectorButton.tsx'
import { IconLink } from '../../../../constants/IconLink.ts'
import { BtnName, Color, SearchIndent, Size } from '../../../../constants/enums.ts'
import Icon from '../../../common/Icon/Icon.tsx'
import { appStore } from '../../../../store/useAppStore.ts'
import { Pointer, QueryService } from '../../../../models/QueryService.ts'
import { useDataStore } from '../../../../store/useDataStore.ts'
import { useAppStore } from '../../../../store/useAppStore.ts'

type Props = {
  fromWay: { fromIcon: IconLink; text: string }
  toWay: { toIcon: IconLink; text: string }
  steps: { stepIcon: IconLink; stepText: string }[]
}

function WayInfo(props: Props) {
  const rooms = useDataStore((state) => state.rooms)
  const queryService = useAppStore((state) => state.queryService)
  const roomFrom = useMemo(() => rooms.find((room) => room.id === queryService.from), [queryService, rooms])
  const roomTo = useMemo(() => rooms.find((room) => room.id === queryService.to), [queryService, rooms])

  //TODO: добавить "неизвестно" для помещений которых нет в таблице
  return (
    <div className={cl.wayInfoWrapper}>
      <div className={cl.wayInfoContent} data-no-drag="true">
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
            <Icon classNameExt={cl.wayStepsIcon} iconLink={props.fromWay.fromIcon} color={Color.INITIAL} />
            <p className={cl.wayStepsText}>{props.fromWay.text}</p>
          </li>
          {props.steps.map((step, index) => (
            <li key={index} className={cl.wayStepsItem}>
              <Icon classNameExt={cl.wayStepsIcon} iconLink={step.stepIcon} color={Color.INITIAL} />
              <p className={cl.wayStepsText}>{step.stepText}</p>
            </li>
          ))}
          <li className={cl.wayStepsItem}>
            <Icon classNameExt={cl.wayStepsIcon} iconLink={props.toWay.toIcon} color={Color.INITIAL} />
            <p className={cl.wayStepsText}>{props.toWay.text}</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default WayInfo
