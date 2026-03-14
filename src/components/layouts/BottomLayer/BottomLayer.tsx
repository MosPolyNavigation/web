import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import cl from './BottomLayer.module.scss'
import IconButton from '../../buttons/IconButton/IconButton.tsx'
import { IconLink } from '../../../constants/IconLink.ts'
import classNames from 'classnames'
import { CardState, Layout } from '../../../constants/enums.ts'
import { appStore, useAppStore } from '../../../store/useAppStore.ts'
import { useDrag } from '../../../hooks/useDrag.ts'
import SearchMenu from './SearchMenu/SearchMenu.tsx'
import SpaceInfo from './SpaceInfo/SpaceInfo.tsx'
import WayInfo from './WayInfo/WayInfo.tsx'
import { Pointer, QueryService } from '../../../models/QueryService.ts'
import { useShowDodLayout } from '../../../hooks/useMediaQuery.ts'

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

  /** Есть ли активный маршрут и показывать ли его */
  const activeRoute = activeLayout !== Layout.SEARCH && queryService.steps && queryService.from && queryService.to

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
    minTranslateY:
      bottomCardState === CardState.FULLSCREEN ||
      (bottomCardState === CardState.EXPANDED && activeLayout === Layout.SEARCH)
        ? 0
        : null,
    onDragEnd: (deltaY, e) => {
      if (Math.abs(deltaY) > 20) {
        e.stopPropagation()
        e.preventDefault()
      }
      const threshold = 100

      if (bottomCardState !== CardState.FULLSCREEN && deltaY < -threshold) {
        setBottomCardState(CardState.FULLSCREEN)
        // Если потянули сильно вниз или панелька находятся достаточно снизу (менее 60пикс от нижнего края экрана)
      } else if (
        deltaY > threshold ||
        (containerRef.current && innerHeight - containerRef.current?.getBoundingClientRect().y < 60)
      ) {
        // Действия при закрытии

        if (bottomCardState === CardState.FULLSCREEN || bottomCardState === CardState.EXPANDED) {
          if (activeLayout === Layout.SEARCH) {
            setBottomCardState(CardState.HIDDEN)
            appStore().changeLayout(appStore().previousLayout)
          } else {
            setBottomCardState(CardState.COLLAPSED)
          }
        } else if (bottomCardState === CardState.COLLAPSED) {
          if (appStore().selectedRoomId) {
            appStore().changeSelectedRoom(null)
          } else if (activeRoute) {
            appStore().setQueryService(new QueryService({ from: Pointer.NOTHING, to: Pointer.NOTHING }))
          }
          setBottomCardState(CardState.HIDDEN)
        }
      }
    },
  })

  const { showDodLayout } = useShowDodLayout()

  //TODO: переделать на навешивание классов через время
  const layerClassNames = classNames(cl.bottomLayer, {
    [cl.hidden]: bottomCardState === CardState.HIDDEN,
    [cl.expanded]: bottomCardState === CardState.EXPANDED,
    [cl.fullscreen]: bottomCardState === CardState.FULLSCREEN,
    [cl.dragging]: isDragging,
    [cl.inDodLayout]: showDodLayout,
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
      {activeLayout === Layout.SEARCH && <SearchMenu />}
      {/*TODO: По идее надо добавить в стор сосотояния для открытого SpaceInfo и WayInfo чтобы вот так костыльно не делать*/}
      {activeLayout !== Layout.SEARCH && queryService.steps === undefined && (
        <SpaceInfo expanded={bottomCardState === CardState.FULLSCREEN} />
      )}
      {activeRoute && <WayInfo />}
    </div>
  )
}

export default BottomLayer
