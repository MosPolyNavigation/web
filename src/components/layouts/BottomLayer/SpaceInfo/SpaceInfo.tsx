import { FC, useCallback, useEffect, useMemo } from 'react'
import cl from './SpaceInfo.module.scss'
import Icon from '../../../common/Icon/Icon.tsx'
import { IconLink } from '../../../../constants/IconLink.ts'
import { Color, Size } from '../../../../constants/enums.ts'
import Button from '../../../buttons/LargeButton/Button.tsx'
import { appStore, useAppStore } from '../../../../store/useAppStore.ts'
import { QueryService } from '../../../../models/QueryService.ts'
import { useDataStore } from '../../../../store/useDataStore.ts'
import classNames from 'classnames'
import { useNavigate } from 'react-router'
import { useIsDesktop } from '../../../../hooks/useMediaQuery.ts'
import { RoomData } from '../../../../constants/types.ts'

const SpaceInfo: FC<{ expanded: boolean }> = ({ expanded }) => {
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()
  const selectedRoomId = useAppStore((state) => state.selectedRoomId)
  const rooms = useDataStore((state) => state.rooms)
  const room = useMemo(() => rooms.find((room) => room.id === selectedRoomId), [selectedRoomId, rooms])

  useEffect(() => {
    console.log(room)
  }, [room])

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
          text: `Делаюсь с тобой аудиторией в приложении Политех Навигация!

${room.title}`,
          url: roomLink,
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
    [expanded]
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
          room && room.subTitle.split('\n').map((part) => <p>{part}</p>)
        )}
      </div>

      {renderActions(cl.topActions, IconLink.SHARE, () => shareBtnHandler(room))}
      {renderActions(cl.bottomActions, IconLink.PROBLEM, () => navigate('/report'))}
    </div>
  )
}

export default SpaceInfo
