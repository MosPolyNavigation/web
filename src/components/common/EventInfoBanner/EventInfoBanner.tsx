import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import Button from '../../buttons/LargeButton/Button.tsx'
import Icon from '../Icon/Icon.tsx'
import { Color, Layout, SearchIndent, Size } from '../../../constants/enums.ts'
import { IconLink } from '../../../constants/IconLink.ts'
import { useDataStore } from '../../../store/useDataStore.ts'
import { appStore, useAppStore } from '../../../store/useAppStore.ts'
import { EVENT_INFO } from '../../../constants/eventInfo.ts'
import { isBannerDebugOverrideEnabled } from '../../../utils/bannerDebugOverride.ts'
import cl from './EventInfoBanner.module.scss'

const EVENT_BANNER_STORAGE_KEY = 'eventInfoBannerDismissedDay'
const BS_CAMPUS_ALIASES = new Set(['bs', 'бс'])

function getTodayStorageKey() {
  return getMoscowDateKey()
}

function getMoscowDateKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function normalizeCampusValue(value: string | undefined) {
  return value?.trim().toLowerCase()
}

function isEventBannerDismissedToday() {
  try {
    return localStorage.getItem(EVENT_BANNER_STORAGE_KEY) === getTodayStorageKey()
  } catch {
    return false
  }
}

function markEventBannerDismissedToday() {
  try {
    localStorage.setItem(EVENT_BANNER_STORAGE_KEY, getTodayStorageKey())
  } catch {
    /* ignore */
  }
}

const EventInfoBanner = () => {
  const [searchParams] = useSearchParams()
  const activeLayout = useAppStore((state) => state.activeLayout)
  const currentPlan = useAppStore((state) => state.currentPlan)
  const rooms = useDataStore((state) => state.rooms)
  const forceShowBanners = isBannerDebugOverrideEnabled(searchParams)
  const [visible, setVisible] = useState(() => !isEventBannerDismissedToday())

  const isEventDate = useMemo(() => getMoscowDateKey() === EVENT_INFO.bannerDateMoscow, [])
  const isBsCampus = useMemo(() => {
    const campusId = normalizeCampusValue(currentPlan?.corpus.location.id)
    const campusShort = normalizeCampusValue(currentPlan?.corpus.location.short)
    const campusTitle = normalizeCampusValue(currentPlan?.corpus.location.title)

    return (
      BS_CAMPUS_ALIASES.has(campusId ?? '') ||
      BS_CAMPUS_ALIASES.has(campusShort ?? '') ||
      campusTitle === 'большая семёновская' ||
      campusTitle === 'большая семеновская'
    )
  }, [currentPlan])

  const hasEventRooms = useMemo(() => {
    if (!currentPlan) {
      return false
    }

    return rooms.some((room) => room.event && room.plan?.corpus.location === currentPlan.corpus.location)
  }, [currentPlan, rooms])

  const dismiss = useCallback(() => {
    if (forceShowBanners) {
      return
    }

    markEventBannerDismissedToday()
    setVisible(false)
  }, [forceShowBanners])

  const openSearch = useCallback(() => {
    appStore().setSearchIndent(SearchIndent.SELECT)
    appStore().setSearchQuery('')
    appStore().changeLayout(Layout.SEARCH)
  }, [])

  if (!forceShowBanners && !visible) {
    return null
  }

  if (!forceShowBanners && (activeLayout !== Layout.PLAN || !isEventDate || !isBsCampus || !hasEventRooms)) {
    return null
  }

  return (
    <div className={cl.banner} role='status' aria-label='Информация о событии'>
      <div className={cl.inner}>
        <div className={cl.content}>
          <div className={cl.titleRow}>
            <div className={cl.titleGroup}>
              <p className={cl.eyebrow}>Сегодня в кампусе</p>
              <p className={cl.title}>{EVENT_INFO.title}</p>
              <p className={cl.subtitle}>{EVENT_INFO.subtitle}</p>
            </div>
            <button type='button' className={cl.close} onClick={dismiss} aria-label='Закрыть'>
              <Icon size={Size.S} iconLink={IconLink.CROSS} color={Color.C4} />
            </button>
          </div>

          <p className={cl.description}>{EVENT_INFO.bannerDescription}</p>

          <div className={cl.actions}>
            <Button color={Color.BLUE} text='Открыть поиск' onClick={openSearch} size={Size.S} fullWidth />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventInfoBanner
