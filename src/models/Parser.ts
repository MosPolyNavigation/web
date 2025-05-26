import { PlanData, RoomData, RoomType } from '../constants/types.ts'
import { IconLink } from '../constants/IconLink.ts'
import { RoomDto } from './data/types/dto.ts'

export class Parser {
  static fillRoomData(inRoom: RoomDto, plan: PlanData): RoomData | null {
    const type = inRoom.type as RoomType
    const tabletText = (() => {
      if (!inRoom.tabletText || inRoom.tabletText === '-' || inRoom.tabletText === '—') return ''
      return inRoom.tabletText
    })()
    const numberOrTitle = (() => {
      if (!inRoom.numberOrTitle || inRoom.numberOrTitle === '-' || inRoom.numberOrTitle === '—') return ''
      return inRoom.numberOrTitle
    })()

    const icon: IconLink | null = (function () {
      switch (type) {
        case 'Администрация':
          return IconLink.LEGAL
        case 'Приёмная комиссия':
          return IconLink.LEGAL
        case 'Библиотека / читальный зал':
          return IconLink.BOOK
        case 'Лифт':
          return IconLink.ELEVATOR
        case 'Вход в здание':
          return IconLink.ENTER
        case 'Гардероб / раздевалка':
          return IconLink.GARDEROB
        case 'Женский туалет':
          return IconLink.WOMAN
        case 'Мужской туалет':
          return IconLink.MEN
        case 'Общий туалет':
          return IconLink.WC
        case 'Коворкинг':
          return IconLink.COWORKING
        case 'Лестница':
          return IconLink.STAIR
        case 'Общественное пространство / актовый или концертный зал':
          return IconLink.ACT
        case 'Переход между корпусами':
          return IconLink.CROSSING
        case 'Спортивный зал':
          return IconLink.SPORT
        case 'Столовая / кафе':
          return IconLink.FOOD
        case 'Учебная аудитория':
          return IconLink.STUDY
        case 'Клуб / секция / внеучебка':
          return IconLink.STUDY
        case 'Лаборатория':
          return IconLink.STUDY
        case 'Лекторий':
          return IconLink.STUDY
        default:
          return null
      }
    })()
    const { title, subTitle }: { title: string; subTitle: string } = (function () {
      function getCorpusFloorSubtitle() {
        return `${plan.corpus.location.short}, Корпус ${plan.corpus.title}, ${plan.floor}-й этаж`
      }

      if (tabletText) {
        let title = ''
        if (numberOrTitle) title = numberOrTitle
        title += ` — ${tabletText}`
        return {
          title: title,
          subTitle: inRoom.addInfo ? inRoom.addInfo.trim() : '',
        }
      }
      if (
        ['Женский туалет', 'Коворкинг', 'Лифт', 'Мужской туалет', 'Общий туалет', 'Столовая / кафе'].includes(
          inRoom.type
        )
      )
        return {
          title: inRoom.type,
          subTitle: getCorpusFloorSubtitle(),
        }
      if (inRoom.type === 'Лестница') {
        let title = ''
        if (numberOrTitle && numberOrTitle !== '-') title = `${numberOrTitle} лестница`
        else title = 'Лестница'
        return {
          title: title,
          subTitle: getCorpusFloorSubtitle(),
        }
      }
      if (inRoom.type === 'Вход в здание')
        return {
          title: `Вход в корпус ${plan.corpus.title}`,
          subTitle: '',
        }
      return {
        title: numberOrTitle,
        subTitle: '',
      }
    })()

    if (!inRoom.id.startsWith('!'))
      return {
        id: inRoom.id,
        title: title ?? '-',
        subTitle: subTitle ?? '-',
        plan: plan,
        type: type,
        icon: icon,
        available: inRoom.available,
      }
    else return null
  }
}
