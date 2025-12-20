import React, { FC, useMemo } from 'react'

import { Layout, CardState } from '../../../constants/enums.ts'

import classNames from 'classnames'
import cl from './BottomControlsLayer.module.scss'

import { useAppStore } from '../../../store/useAppStore.ts'

import BaseControls from './BaseControls/BaseControls.tsx'
import OnWayControls from './OnWayControls/OnWayControls.tsx'
import WaySelectorsControls from './WaySelectorsControls/WaySelectorsControls.tsx'

const BottomControlsLayer: FC = () => {
  const activeLayout = useAppStore((state) => state.activeLayout)
  const selectedRoomId = useAppStore((state) => state.selectedRoomId)
  const queryService = useAppStore((state) => state.queryService)
  const bottomLayerTranslateY = useAppStore((state) => state.bottomLayerTranslateY)
  const bottomLayerState = useAppStore((state) => state.bottomLayerState)

  const hasBottomLayerData = !!selectedRoomId || !!queryService.steps

  // Вычисляем финальную позицию: учитываем и translateY во время драга, и финальное состояние
  const finalTranslateY = useMemo(() => {
    // Если нет данных для BottomLayer, не применяем никаких смещений
    if (!hasBottomLayerData) {
      return 0
    }
    
    // Если идет драг, используем translateY (только положительные значения - движение вниз)
    if (bottomLayerTranslateY > 0) {
      return bottomLayerTranslateY
    }
    
    // Если BottomLayer скрыт и не в режиме поиска, сдвигаем вниз
    // Разница между COLLAPSED (translate: 0 calc(100dvh - toRem(130))) и HIDDEN (translate: 0 100dvh)
    // toRem(130) = 130/14 ≈ 9.29rem, при базовом rem=16px это ≈ 148px, но используем приблизительное значение
    if (bottomLayerState === CardState.HIDDEN && activeLayout !== Layout.SEARCH) {
      // Сдвигаем вниз на расстояние, равное разнице позиций
      // Это должно быть примерно равно toRem(130), что примерно 130-150px в зависимости от размера шрифта
      return 130
    }
    
    return 0
  }, [bottomLayerTranslateY, bottomLayerState, activeLayout, hasBottomLayerData])

  const style = finalTranslateY !== 0 ? {
    transform: `translateY(${finalTranslateY}px)`,
    transition: bottomLayerTranslateY !== 0 ? 'none' : 'all 300ms ease', // Плавный переход только когда не драгаем
  } : undefined

  const isBottomLayerHidden = bottomLayerState === CardState.HIDDEN && activeLayout !== Layout.SEARCH && hasBottomLayerData

  return (
    <div
      className={classNames(cl.bottomControlsLayer, {
        [cl.centered]: hasBottomLayerData && activeLayout !== Layout.SEARCH && !isBottomLayerHidden,
        [cl.bottomLayerHidden]: isBottomLayerHidden,
        [cl.searchOpen]: activeLayout === Layout.SEARCH,
        [cl.flexCenter]: (queryService.from || queryService.to) && !(queryService.from && queryService.to),
      })}
      style={style}
    >
      {(queryService.from || queryService.to) &&
      !(queryService.from && queryService.to) &&
      activeLayout !== Layout.SEARCH ? (
        <WaySelectorsControls />
      ) : queryService.from && queryService.to && activeLayout !== Layout.SEARCH ? (
        <OnWayControls />
      ) : (
        <BaseControls />
      )}
    </div>
  )
}

export default BottomControlsLayer
