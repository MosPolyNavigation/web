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
  const previousState = useRef<CardState>(bottomCardState)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeLayout === Layout.SEARCH) {
      setBottomCardState(CardState.EXPANDED)
    } else if (selectedRoomId || queryService.steps) {
      setBottomCardState(CardState.COLLAPSED)
    } else {
      setBottomCardState(CardState.HIDDEN)
    }
  }, [selectedRoomId, activeLayout, queryService])

  useEffect(() => {
    setTimeout(() => {
      // console.log(previousState.current, ' => ', bottomCardState);
      previousState.current = bottomCardState
    }, 50)
  }, [bottomCardState])

  const { isDragging, translateY, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown } = useDrag({
    enabled: bottomCardState !== CardState.HIDDEN,
    onDragMove: (clientY, deltaY) => {
      const canMoveUp = bottomCardState !== CardState.FULLSCREEN && deltaY < 0
      const canMoveDown = bottomCardState === CardState.FULLSCREEN && deltaY > 0
      
      if (!canMoveUp && !canMoveDown) {
        return
      }
    },
    onDragEnd: (deltaY) => {
      const threshold = 50
      
      if (bottomCardState !== CardState.FULLSCREEN && deltaY < -threshold) {
        setBottomCardState(CardState.FULLSCREEN)
      } else if (bottomCardState === CardState.FULLSCREEN && deltaY > threshold) {
        const newState = activeLayout === Layout.SEARCH ? CardState.EXPANDED : CardState.COLLAPSED
        setBottomCardState(newState)
      }
    }
  })

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

  return (
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
  )
}

export default BottomLayer
