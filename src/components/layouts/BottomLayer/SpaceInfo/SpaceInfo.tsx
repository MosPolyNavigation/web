import { FC, useMemo } from 'react'
import cl from './SpaceInfo.module.scss'
import Icon from '../../../common/Icon/Icon.tsx'
import { IconLink } from '../../../../constants/IconLink.ts'
import { Color, Size } from '../../../../constants/enums.ts'
import Button from '../../../buttons/LargeButton/Button.tsx'
import { appStore, useAppStore } from '../../../../store/useAppStore.ts'
import { QueryService } from '../../../../models/QueryService.ts'
import { useDataStore } from '../../../../store/useDataStore.ts'
import ImageCarousel from '../../../common/ImageCarousel/ImageCarousel.tsx'

// Mock images - в будущем можно получать из данных комнаты
const mockImages = [
  'https://avatars.mds.yandex.net/i?id=8dced079671fe04155e8c40ac057373486ec132a-4531115-images-thumbs&n=13',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
  'https://avatars.mds.yandex.net/i?id=c5775b89f0c0c4b9518d3c7f85a66c084f2176d4-9847927-images-thumbs&n=13'
]

const SpaceInfo: FC = () => {
  const selectedRoomId = useAppStore((state) => state.selectedRoomId)
  const rooms = useDataStore((state) => state.rooms)
  const room = useMemo(() => rooms.find((room) => room.id === selectedRoomId), [selectedRoomId, rooms])
  
  const images = mockImages // В будущем: room?.images || mockImages

  function fromBtnHandler() {
    appStore().setQueryService(new QueryService({ from: selectedRoomId }))
    appStore().changeSelectedRoom(null)
  }

  function toBtnHandler() {
    appStore().setQueryService(new QueryService({ to: selectedRoomId }))
    appStore().changeSelectedRoom(null)
  }

  if (!selectedRoomId) {
    return null
  }

  return (
    <div className={cl.spaceInfo}>
      <div className={cl.title}>
        {room && room.icon && <Icon color={Color.INITIAL} classNameExt={cl.spaceIcon} iconLink={room.icon} />}
        <span>{(room && room.title) ?? <span>&nbsp;</span>}</span>
      </div>

      <div className={cl.location}>{room && room.subTitle == '' ? <span>&nbsp;</span> : room && room.subTitle}</div>

      <ImageCarousel images={images} alt={room?.title || 'Room'} />

      <div className={cl.actions}>
        <Button classNameExt={cl.heartBtn} color={Color.C4} size={Size.S} iconLink={IconLink.HEART} />
        <Button color={Color.BLUE} size={Size.S} iconLink={IconLink.FROM} text="Отсюда" onClick={fromBtnHandler} />
        <Button color={Color.BLUE} size={Size.S} iconLink={IconLink.TO} text="Сюда" onClick={toBtnHandler} />
      </div>
    </div>
  )
}

export default SpaceInfo
