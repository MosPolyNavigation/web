import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import cl from './BottomLayer.module.scss'
import IconButton from '../../buttons/IconButton/IconButton.tsx'
import { IconLink } from '../../../constants/IconLink.ts'
import classNames from 'classnames'
import { Layout, CardState } from '../../../constants/enums.ts'
import useOnHideRemover from '../../../hooks/useOnHideRemover.ts'
import { appStore, useAppStore } from '../../../store/useAppStore.ts'
import { useDrag } from '../../../hooks/useDrag.ts'

interface BottomLayerProps {
  children?: ReactNode
}

const BottomLayer: FC<BottomLayerProps> = ({ children }) => {
  const activeLayout = useAppStore((state) => state.activeLayout)
  const selectedRoomId = useAppStore((state) => state.selectedRoomId)
  const queryService = useAppStore((state) => state.queryService)

  const [bottomCardState, setBottomCardState] = useState<CardState>(CardState.HIDDEN)
  const [isManuallyHidden, setIsManuallyHidden] = useState(false)
  const previousState = useRef<CardState>(bottomCardState)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeLayout === Layout.SEARCH) {
      setBottomCardState(CardState.EXPANDED)
      setIsManuallyHidden(false)
      appStore().setBottomLayerState(CardState.EXPANDED)
    } else if (selectedRoomId || queryService.steps) {
      if (!isManuallyHidden) {
        setBottomCardState(CardState.COLLAPSED)
        appStore().setBottomLayerState(CardState.COLLAPSED)
      }
    } else {
      setBottomCardState(CardState.HIDDEN)
      setIsManuallyHidden(false)
      appStore().setBottomLayerState(CardState.HIDDEN)
    }
  }, [selectedRoomId, activeLayout, queryService, isManuallyHidden])

  useEffect(() => {
    setTimeout(() => {
      // console.log(previousState.current, ' => ', bottomCardState);
      previousState.current = bottomCardState
    }, 50)
  }, [bottomCardState])

  const { isDragging, translateY, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown } = useDrag({
    enabled: bottomCardState !== CardState.HIDDEN && activeLayout !== Layout.SEARCH,
    onDragMove: (clientY, deltaY) => {
      const canMoveUp = bottomCardState !== CardState.FULLSCREEN && deltaY < 0
      const canMoveDown = bottomCardState === CardState.FULLSCREEN && deltaY > 0
      const canMoveDownToHide = (bottomCardState === CardState.COLLAPSED || bottomCardState === CardState.EXPANDED) && deltaY > 0 && activeLayout !== Layout.SEARCH

      if (!canMoveUp && !canMoveDown && !canMoveDownToHide) {
        return
      }
      
      // Синхронизируем позицию с BottomControlsLayer
      appStore().setBottomLayerTranslateY(translateY)
    },
    onDragEnd: (deltaY) => {
      const threshold = 100

      if (bottomCardState !== CardState.FULLSCREEN && deltaY < -threshold) {
        const newState = CardState.FULLSCREEN
        setBottomCardState(newState)
        appStore().setBottomLayerState(newState)
        appStore().setBottomLayerTranslateY(0)
      } else if (bottomCardState === CardState.FULLSCREEN && deltaY > threshold) {
        const newState = activeLayout === Layout.SEARCH ? CardState.EXPANDED : CardState.COLLAPSED
        setBottomCardState(newState)
        appStore().setBottomLayerState(newState)
        appStore().setBottomLayerTranslateY(0)
      } else if ((bottomCardState === CardState.COLLAPSED || bottomCardState === CardState.EXPANDED) && deltaY > threshold && activeLayout !== Layout.SEARCH) {
        const newState = CardState.HIDDEN
        setBottomCardState(newState)
        setIsManuallyHidden(true)
        appStore().setBottomLayerState(newState)
        appStore().setBottomLayerTranslateY(0)
      } else {
        appStore().setBottomLayerTranslateY(0)
      }
    },
  })
  
  // Сбрасываем translateY когда не драгаем
  useEffect(() => {
    if (!isDragging) {
      appStore().setBottomLayerTranslateY(0)
    }
  }, [isDragging])

  //TODO: переделать на навешивание классов через время
  const layerClassNames = classNames(cl.bottomLayer, {
    [cl.hidden]: bottomCardState === CardState.HIDDEN,
    [cl.expanded]: bottomCardState === CardState.EXPANDED,
    [cl.fullscreen]: bottomCardState === CardState.FULLSCREEN,
    [cl.dragging]: isDragging,
  })

  const containerStyle = {
    transform: isDragging ? `translateY(${translateY}px)` : undefined,
    transition: isDragging ? 'none' : undefined,
  }

  const handleShowBottomLayer = () => {
    setIsManuallyHidden(false)
    if (selectedRoomId || queryService.steps) {
      setBottomCardState(CardState.COLLAPSED)
      appStore().setBottomLayerState(CardState.COLLAPSED)
    }
  }

  const shouldShowIndicator = isManuallyHidden && (selectedRoomId || queryService.steps) && activeLayout !== Layout.SEARCH

  return (
    <>
      {shouldShowIndicator && (
        <div className={cl.showIndicator} onClick={handleShowBottomLayer}>
          <div className={cl.indicatorSlider}></div>
        </div>
      )}
      <div
        ref={containerRef}
        className={layerClassNames}
        style={containerStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className={cl.slider}></div>
        {activeLayout !== Layout.SEARCH && !queryService.steps && (
          <IconButton
            onClick={() => appStore().changeSelectedRoom(null)}
            className={cl.closeBtn}
            iconLink={IconLink.CROSS}
          />
        )}
        {children}
      </div>
    </>
  )
}

export default BottomLayer
