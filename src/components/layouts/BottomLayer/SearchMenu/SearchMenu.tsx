import { FC, useEffect, useMemo, useRef, useState } from 'react'
import cl from './SearchMenu.module.scss'
import { IconLink } from '../../../../constants/IconLink.ts'
import Button from '../../../buttons/LargeButton/Button.tsx'
import { Color, Layout, SearchIndent, Size } from '../../../../constants/enums.ts'
import MenuItem from '../../../menuopmponents/MenuItem/MenuItem.tsx'
import { useDataStore } from '../../../../store/useDataStore.ts'
import { appStore, useAppStore } from '../../../../store/useAppStore.ts'
import { RoomData, RoomType } from '../../../../constants/types.ts'
import { QueryService } from '../../../../models/QueryService.ts'
import { searchRooms } from '../../../../functions/roomSearch.ts'
import { useDebounce } from '../../../../hooks/useDebounce.ts'
import { EVENT_INFO } from '../../../../constants/eventInfo.ts'

// Включить отображение события в поиске
const ENABLE_EVENT = false

const SearchMenu: FC = () => {
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
        currentPlan: planModel?.plan || null,
      })
    } else {
      return []
    }
  }, [rooms, debouncedSearchQuery, planModel])

  const eventRooms = useMemo(() => rooms.filter((room) => room.event), [rooms])
  const searchedEventRooms = useMemo(() => roomsRenderList.filter((room) => room.event), [roomsRenderList])
  const searchedCommonRooms = useMemo(() => roomsRenderList.filter((room) => !room.event), [roomsRenderList])

  /** Список быстрого поиска: ближайшие туалеты и входы */
  const quicks: RoomData[] = useMemo(() => {
    const quicks: RoomData[] = []
    // Заполнение ближайших важных помещений
    const currentPlan = planModel?.plan
    if (currentPlan) {
      const roomsInCurrentCorpus = rooms.filter((room) => room.plan && room.plan.corpus === currentPlan.corpus)
      const types: RoomType[] = ['Мужской туалет', 'Женский туалет', 'Вход в здание']
      const roomsByTypes = types.map((type) => roomsInCurrentCorpus.filter((room) => room.type === type))
      const nearestRoomsByTypes = roomsByTypes.map((roomsByType) =>
        roomsByType
          .filter((r) => r.plan)
          .sort((a, b) => Math.abs(currentPlan.floor - a.plan!.floor) - Math.abs(currentPlan.floor - b.plan!.floor))
      )
      const nearests = nearestRoomsByTypes.filter((typeArr) => typeArr.length > 0).map((typeArr) => typeArr[0])
      quicks.push(...nearests)
    }

    return quicks
  }, [planModel, rooms])

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
    const searchIndent = appStore().searchIndent

    if (searchIndent === SearchIndent.SELECT) {
      appStore().changeCurrentPlan(room.plan)
      appStore().changeSelectedRoom(room.id)
    } else if (searchIndent === SearchIndent.SET_FROM) {
      appStore().setQueryService(new QueryService({ from: room.id }))
    } else if (searchIndent === SearchIndent.SET_TO) {
      appStore().setQueryService(new QueryService({ to: room.id }))
    }
    appStore().changeLayout(Layout.PLAN)
  }

  function getTitle(room: RoomData): string {
    if (room.event || room.type === 'Вход в здание') {
      return room.title
    } else {
      return `Ближайший ${room.title.toLowerCase()}`
    }
  }

  function renderMenuItems(list: RoomData[], options?: { event?: boolean; quickTitle?: boolean; firstIndexOffset?: number }) {
    const { event = false, quickTitle = false, firstIndexOffset = 0 } = options ?? {}

    return list.map((room, index) => (
      <MenuItem
        key={`${room.id}-${firstIndexOffset + index}`}
        onClick={() => menuItemClickHandler(room)}
        text={event ? room.title : quickTitle ? getTitle(room) : room.title}
        addText={room.subTitle}
        iconLink={room.icon}
        isFirst={index === 0}
        isLast={index === list.length - 1}
        accented={event}
        color={event ? Color.BLUE : resultProps.color}
        size={resultProps.size}
      />
    ))
  }

  function renderEventSection(list: RoomData[]) {
    if (list.length === 0) {
      return null
    }

    return (
      <section className={cl.eventSection}>
        <div className={cl.eventSectionLabel}>Событие</div>
        <div className={cl.eventSectionHeader}>
          <div className={cl.eventSectionTitle}>{EVENT_INFO.title}</div>
          <div className={cl.eventSectionSubtitle}>{EVENT_INFO.subtitle}</div>
        </div>
        <div className={cl.sectionItems}>{renderMenuItems(list, { event: true })}</div>
      </section>
    )
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
              <>
                {ENABLE_EVENT && renderEventSection(searchedEventRooms)}
                {searchedCommonRooms.length > 0 && (
                  <section className={cl.section}>
                    {ENABLE_EVENT && searchedEventRooms.length > 0 && <div className={cl.sectionLabel}>Другие результаты</div>}
                    <div className={cl.sectionItems}>{renderMenuItems(searchedCommonRooms)}</div>
                  </section>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {ENABLE_EVENT && renderEventSection(eventRooms)}
            {quicks.length > 0 && (
              <section className={cl.section}>
                {eventRooms.length > 0 && <div className={cl.sectionLabel}>Быстрый доступ</div>}
                <div className={cl.sectionItems}>
                  {renderMenuItems(quicks, { quickTitle: true, firstIndexOffset: eventRooms.length })}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <div className={cl.quickActions}>
        <Button iconLink={IconLink.WOMAN} {...actionBtnsProps} />
        <Button iconLink={IconLink.MEN} {...actionBtnsProps} />
        <Button iconLink={IconLink.BOOK} {...actionBtnsProps} />
        <Button iconLink={IconLink.ENTER} text='Вход' {...actionBtnsProps} />
        <Button iconLink={IconLink.ACT} text='А 100' {...actionBtnsProps} />
        <Button iconLink={IconLink.FOOD} text='Б 2 этаж' {...actionBtnsProps} />
      </div>
    </div>
  )
}

export default SearchMenu
