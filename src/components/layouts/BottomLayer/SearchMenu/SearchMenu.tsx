import { FC, useEffect, useMemo, useRef, useState } from 'react'
import cl from './SearchMenu.module.scss'
import { IconLink } from '../../../../constants/IconLink.ts'
import Button from '../../../buttons/LargeButton/Button.tsx'
import { Color, Layout, SearchIndent, Size } from '../../../../constants/enums.ts'
import MenuItem from '../../../menuopmponents/MenuItem/MenuItem.tsx'
import { dataStore, useDataStore } from '../../../../store/useDataStore.ts'
import { appStore, useAppStore } from '../../../../store/useAppStore.ts'
import { RoomData, RoomType } from '../../../../constants/types.ts'
import { QueryService } from '../../../../models/QueryService.ts'
import { searchRooms } from '../../../../functions/roomSearch.ts'
import { useDebounce } from '../../../../hooks/useDebounce.ts'

interface SearchMenuProps {
  a?: boolean
}

const SearchMenu: FC<SearchMenuProps> = () => {
  const rooms = useDataStore((state) => state.rooms)
  const resultsRef = useRef<HTMLDivElement | null>(null)
  const [results, setResults] = useState(false)
  const searchQuery = useAppStore((state) => state.searchQuery)
  const planModel = useAppStore((state) => state.planModel)
  const componentRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const debouncedSearchQuery = useDebounce(searchQuery, 200)

  useEffect(() => {
    //при скролле убираем фокус с инпута
    componentRef.current?.addEventListener('touchmove', () => {
      buttonRef.current?.focus()
    })
  }, [])

  const roomsRenderList = useMemo(() => {
    if (debouncedSearchQuery.trim()) {
      return searchRooms(rooms, debouncedSearchQuery, {
        currentPlan: planModel?.plan || null
      })
    } else {
      return []
    }
  }, [rooms, debouncedSearchQuery, planModel])

  const nearestRooms: Array<RoomData[]> = useMemo(() => {
    const currentPlan = planModel?.plan
    if (!currentPlan) return []
    const roomsInCurrentCorpus = dataStore().rooms.filter((room) => room.plan && room.plan.corpus === currentPlan.corpus)
    const types: RoomType[] = ['Мужской туалет', 'Женский туалет', 'Вход в здание']
    const roomsByTypes = types.map((type) => roomsInCurrentCorpus.filter((room) => room.type === type))
    const nearestRoomsByTypes = roomsByTypes.map((roomsByType) =>
      roomsByType
        .filter((r) => r.plan)
        .sort(
          (a, b) => Math.abs(currentPlan.floor - (a.plan!.floor)) - Math.abs(currentPlan.floor - (b.plan!.floor))
        )
    )
    console.log(nearestRoomsByTypes)
    return nearestRoomsByTypes
  }, [planModel])

  // Сбрасываем результаты через полсекунды
  useEffect(() => {
    setTimeout(() => {
      setResults(true)
    }, 500)
  }, [])

  const actionBtnsProps = {
    size: Size.S as Size.S,
    color: Color.INITIAL,
  }

  const resultProps = {
    color: Color.INITIAL,
    size: Size.S as Size.S,
  }

  // При изменении результатов скролл вниз
  useEffect(() => {
    if (results) {
      if (resultsRef.current) {
        resultsRef.current.scrollTo(0, 0)
      }
    }
  }, [resultsRef, results])

  function menuItemClickHandler(room: RoomData) {
    console.log(room.title, room.subTitle)
    const searchIndent = appStore().searchIndent

    if (searchIndent === SearchIndent.SELECT) {
      appStore().changeCurrentPlan(room.plan)
      appStore().changeSelectedRoom(room.id)
    } else if (searchIndent === SearchIndent.SET_FROM) {
      appStore().setQueryService(new QueryService({ from: room.id }))
    } else if (searchIndent === SearchIndent.SET_TO) {
      console.log(1123)
      appStore().setQueryService(new QueryService({ to: room.id }))
    }
    appStore().changeLayout(Layout.PLAN)
  }

  function getTitle(room: RoomData): string {
    if (room.type === 'Вход в здание') {
      return room.title
    } else {
      return `Ближайший ${room.title.toLowerCase()}`
    }
  }

  return (
    <div className={cl.searchMenu} ref={componentRef}>
      <div ref={resultsRef} className={cl.results}>
        <>
          {/*Кнопка на которую переходит фокус с текстового поля при скролле */}
          <button ref={buttonRef} className={cl.fakeFocusBtn}>
            buton
          </button>
        </>

        {debouncedSearchQuery ? (
          <>
            {roomsRenderList.length === 0 ? (
              <div className={cl.noResults}>
                <div className={cl.noResultsGif} />
                <div className={cl.noResultsText}>Ничего не найдено</div>
              </div>
            ) : (
              roomsRenderList.map((room, index) => (
                <MenuItem
                  onClick={() => menuItemClickHandler(room)}
                  text={room.title}
                  addText={room.subTitle}
                  iconLink={room.icon}
                  isFirst={index === 0}
                  {...resultProps}
                />
              ))
            )}
          </>
        ) : (
          <>
            {nearestRooms.map(
              (roomsByType, index) =>
                roomsByType.length !== 0 && (
                  <MenuItem
                    onClick={() => menuItemClickHandler(roomsByType[0])}
                    text={getTitle(roomsByType[0])}
                    addText={roomsByType[0].subTitle}
                    iconLink={roomsByType[0].icon}
                    isFirst={index === 0}
                    {...resultProps}
                  />
                )
            )}
          </>
        )}
      </div>

      <div className={cl.quickActions}>
        <Button iconLink={IconLink.WOMAN} {...actionBtnsProps} />
        <Button iconLink={IconLink.MEN} {...actionBtnsProps} />
        <Button iconLink={IconLink.BOOK} {...actionBtnsProps} />
        <Button iconLink={IconLink.ENTER} text="Вход" {...actionBtnsProps} />
        <Button iconLink={IconLink.ACT} text="А 100" {...actionBtnsProps} />
        <Button iconLink={IconLink.FOOD} text="Б 2 этаж" {...actionBtnsProps} />
      </div>
    </div>
  )
}

export default SearchMenu
