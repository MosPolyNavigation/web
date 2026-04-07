import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import cl from './SpaceInfo.module.scss'
import Icon from '../../../common/Icon/Icon.tsx'
import { IconLink } from '../../../../constants/IconLink.ts'
import { Color, Size } from '../../../../constants/enums.ts'
import Button from '../../../buttons/LargeButton/Button.tsx'
import { appStore, useAppStore } from '../../../../store/useAppStore.ts'
import { QueryService } from '../../../../models/QueryService.ts'
import { useDataStore } from '../../../../store/useDataStore.ts'
import classNames from 'classnames'
import { useNavigate, useSearchParams } from 'react-router'
import { useIsDesktop } from '../../../../hooks/useMediaQuery.ts'
import { RoomData } from '../../../../constants/types.ts'

const TIME_RANGE_PATTERN = /^\s*(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})\b/
const DEBUG_TIME_PATTERN = /^(\d{1,2}):(\d{2})$/

type ScheduleParagraphState = 'past' | 'current' | 'future' | null

function getCurrentMinutes() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function parseTimeOverride(value: string | null): number | null {
  if (!value) {
    return null
  }

  const match = value.match(DEBUG_TIME_PATTERN)

  if (!match) {
    return null
  }

  const [, hoursRaw, minutesRaw] = match
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (Number.isNaN(hours) || Number.isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null
  }

  return hours * 60 + minutes
}

function getScheduleParagraphState(part: string, currentMinutes: number): ScheduleParagraphState {
  const match = part.match(TIME_RANGE_PATTERN)

  if (!match) {
    return null
  }

  const [, startHours, startMinutes, endHours, endMinutes] = match
  const start = Number(startHours) * 60 + Number(startMinutes)
  const end = Number(endHours) * 60 + Number(endMinutes)

  if (Number.isNaN(start) || Number.isNaN(end) || start > end) {
    return null
  }

  if (currentMinutes >= end) {
    return 'past'
  }

  if (currentMinutes >= start) {
    return 'current'
  }

  return 'future'
}

const SpaceInfo: FC<{ expanded: boolean }> = ({ expanded }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isDesktop = useIsDesktop()
  const selectedRoomId = useAppStore((state) => state.selectedRoomId)
  const rooms = useDataStore((state) => state.rooms)
  const room = useMemo(() => rooms.find((room) => room.id === selectedRoomId), [selectedRoomId, rooms])
  const [currentMinutes, setCurrentMinutes] = useState(getCurrentMinutes)

  const subtitleParts = useMemo(() => room?.subTitle.split('\n') ?? [], [room?.subTitle])
  const debugTimeOverride = useMemo(
    () => (import.meta.env.DEV ? parseTimeOverride(searchParams.get('debugTime')) : null),
    [searchParams]
  )

  useEffect(() => {
    if (debugTimeOverride !== null) {
      setCurrentMinutes(debugTimeOverride)
      return
    }

    setCurrentMinutes(getCurrentMinutes())

    const intervalId = window.setInterval(() => {
      setCurrentMinutes(getCurrentMinutes())
    }, 30_000)

    return () => window.clearInterval(intervalId)
  }, [debugTimeOverride])

  function fromBtnHandler() {
    appStore().setQueryService(new QueryService({ from: selectedRoomId }))
    appStore().changeSelectedRoom(null)
  }

  function toBtnHandler() {
    appStore().setQueryService(new QueryService({ to: selectedRoomId }))
    appStore().changeSelectedRoom(null)
  }

  async function shareBtnHandler(room: RoomData | undefined) {
    if (!room) {
      appStore().toast.showForTime('Не удалось получить данные о помещении')
      return
    }

    const roomLink = `https://mpunav.ru/?room=${selectedRoomId}`

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(roomLink)
        appStore().toast.showForTime('Ссылка скопирована в буфер обмена')
      } catch (error) {
        appStore().toast.showForTime('Не удалось скопировать ссылку в буфер обмена')
      }
    }

    if (isDesktop) {
      await copyToClipboard()
      return
    } else {
      if (navigator.share) {
        await navigator.share({
          text: `Делюсь с тобой аудиторией в приложении Политех Навигация!

${room.title}
${roomLink}`,
        })
        return
      }
      await copyToClipboard()
    }
  }

  const renderActions = useCallback(
    (classNameExt: string, iconLink: IconLink, onClick: () => void) => {
      return (
        <div className={classNames(cl.actions, classNameExt, { [cl.isExpanded]: expanded })}>
          <Button classNameExt={cl.heartBtn} color={Color.C4} size={Size.S} iconLink={iconLink} onClick={onClick} />
          <Button color={Color.BLUE} size={Size.S} iconLink={IconLink.FROM} text='Отсюда' onClick={fromBtnHandler} />
          <Button color={Color.BLUE} size={Size.S} iconLink={IconLink.TO} text='Сюда' onClick={toBtnHandler} />
        </div>
      )
    },
    [expanded, fromBtnHandler, toBtnHandler]
  )

  if (!selectedRoomId) {
    return null
  }

  return (
    <div className={cl.spaceInfo}>
      <div className={cl.title}>
        {room && room.icon && <Icon color={Color.INITIAL} classNameExt={cl.spaceIcon} iconLink={room.icon} />}
        <span>{(room && room.title) ?? <span>&nbsp;</span>}</span>
      </div>

      <div className={classNames(cl.location, { [cl.isExpanded]: expanded })}>
        {room && room.subTitle == '' ? (
          <span>&nbsp;</span>
        ) : (
          subtitleParts.map((part, index) => {
            const trimmedPart = part.trimEnd()
            const scheduleState = getScheduleParagraphState(trimmedPart, currentMinutes)

            return (
              <p
                key={`${index}-${part}`}
                className={classNames({
                  [cl.headingParagraph]: trimmedPart.endsWith(':'),
                  [cl.pastParagraph]: scheduleState === 'past',
                  [cl.currentParagraph]: scheduleState === 'current',
                })}
              >
                {part}
              </p>
            )
          })
        )}
      </div>

      {renderActions(cl.topActions, IconLink.SHARE, () => shareBtnHandler(room))}
      {renderActions(cl.bottomActions, IconLink.PROBLEM, () => navigate('/report'))}
    </div>
  )
}

export default SpaceInfo
