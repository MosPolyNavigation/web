import { Id, PlanData, RoomModel } from '../../constants/types.ts'
import { copyAttribute, virtualCircleSVGEl } from '../../functions/planFunctions.ts'
import cl from '../../components/layouts/Plan/PlanLayout.module.scss'
import { appStore } from '../../store/useAppStore.ts'
import { statisticApi } from '../../api/statisticApi.ts'
import { dataStore } from '../../store/useDataStore.ts'
import { userStore } from '../../store/useUserStore.ts'

export class PlanModel {
  readonly rooms: Map<Id, RoomModel>

  constructor(
    public plan: PlanData,
    public planSvgEl: SVGSVGElement,
    virtualSvg: SVGSVGElement | HTMLElement
  ) {
    // @ts-expect-error TS2339
    window.planModel = this
    this.rooms = new Map()

    this.initializeSvgStructure(virtualSvg)
    this.setupUnknownElements()
    this.processSpaces()
    this.processEntrances()
    this.assignEntrancesToRooms()
    this.setupRoomClickHandlers()
    this.selectInitialRoom()
  }

  /**
   * Инициализация структуры SVG
   */
  private initializeSvgStructure(virtualSvg: SVGSVGElement | HTMLElement) {
    virtualSvg.querySelector(`g#${this.plan.id} > rect`)?.remove() //Удаление фона (прямоугольника) верхней вложенности, если он есть

    copyAttribute(this.planSvgEl, virtualSvg, 'viewBox') //Копирование атрибутов из спаршенного изображения в реф-свг на страницу
    copyAttribute(this.planSvgEl, virtualSvg, 'xmlns')
    this.planSvgEl.setAttribute('fill', 'none')

    this.planSvgEl.innerHTML = virtualSvg.innerHTML //Установка внутреннего содержимого отображаемого свг из спаршенного
    
    // Добавляем классы для элементов, которые не должны выделяться
    const noSelectSelectors = ['g#Walls', 'g#Textes', 'g#Texts', '#gEntrances', 'g#Icons']
    noSelectSelectors.forEach((selector) => {
      this.planSvgEl.querySelector(selector)?.classList?.add(cl.noSelect)
    })
  }

  /**
   * Настройка обработчиков для неизвестных элементов
   */
  private setupUnknownElements() {
    const addUnknownToastClick = (spaceEl: Element) => {
      spaceEl.addEventListener('click', (e) => {
        //Если есть активный маршрут, аудитория не выделяется
        if (appStore().queryService.steps) return
        const elementId = (e?.target as HTMLElement)?.id
        if (elementId) {
          void statisticApi.sendSelectRoom(elementId, false)
        }
        appStore().toast.showForTime('К сожалению, мы пока не знаем, что здесь')
      })
    }

    const unexploredElement = this.planSvgEl.getElementById('!-unexplored')
    if (unexploredElement) {
      addUnknownToastClick(unexploredElement)
    }
  }

  /**
   * Обработка пространств (помещений)
   */
  private processSpaces() {
    const spacesElement = this.planSvgEl.getElementById('Spaces')
    if (!spacesElement) return

    for (const spaceEl of spacesElement.children) {
      if (spaceEl.id.startsWith('!')) {
        this.addUnknownToastClick(spaceEl)
      } else if (['path', 'rect'].includes(spaceEl.tagName)) {
        this.addRoom(spaceEl as SVGPathElement | SVGCircleElement)
      }
    }
  }

  /**
   * Добавление обработчика для неизвестного элемента
   */
  private addUnknownToastClick(spaceEl: Element) {
    spaceEl.addEventListener('click', (e) => {
      if (appStore().queryService.steps) return
      const elementId = (e?.target as HTMLElement)?.id
      if (elementId) {
        void statisticApi.sendSelectRoom(elementId, false)
      }
      appStore().toast.showForTime('К сожалению, мы пока не знаем, что здесь')
    })
  }

  /**
   * Добавление помещения в коллекцию
   */
  private addRoom(roomEl: SVGPathElement | SVGCircleElement) {
    this.rooms.set(roomEl.id, {
      roomId: roomEl.id,
      roomEl: roomEl,
      entranceEl: virtualCircleSVGEl(), //пусто чтобы не делать проверки
      entranceId: 'null', //тоже пусто чтобы не делать проверки
    })
    roomEl.removeAttribute('opacity') //Удаление оригинального атрибута, потому что с ним плохо работает transition
    roomEl.classList.add(cl.room) //добавляем помещению соответствующий класс, для подсветки
    setTimeout(() => roomEl.classList.add(cl.animated), 20) //Добавление класса анимации чуть позже, чтобы успели обновиться свойства
  }

  /**
   * Обработка входов
   */
  private processEntrances() {
    const entrancesElement = this.planSvgEl.getElementById('Entrances')
    if (!entrancesElement) return

    for (const entranceEl of entrancesElement.children) {
      entranceEl.classList.add(cl.entrance)
      setTimeout(() => entranceEl.classList.add(cl.animated), 20)
    }
  }

  /**
   * Назначение входов помещениям
   */
  private assignEntrancesToRooms() {
    const entrancesIdToEl: Map<Id, SVGCircleElement> = new Map()
    const entrancesElement = this.planSvgEl.getElementById('Entrances')
    
    if (entrancesElement) {
      for (const entranceEl of entrancesElement.children) {
        entrancesIdToEl.set(entranceEl.id, entranceEl as SVGCircleElement)
      }
    }

    const entrancesFromData: Map<Id, Id> = new Map(this.plan.entrances)

    for (const [roomId, roomData] of this.rooms) {
      if (entrancesFromData.get(roomId)) {
        //если вход задан в данных, взять оттуда
        roomData.entranceId = <string>entrancesFromData.get(roomId)
        if (roomData.entranceId) {
          roomData.entranceEl = <SVGCircleElement>entrancesIdToEl.get(roomData.entranceId)
        }
      } else {
        //Иначе вычислить (только для прямоугольников)
        this.findEntranceForRoom(roomData, entrancesIdToEl)
      }
    }
  }

  /**
   * Поиск входа для помещения
   */
  private findEntranceForRoom(roomData: RoomModel, entrancesIdToEl: Map<Id, SVGCircleElement>) {
    for (const [entranceId, entranceEl] of entrancesIdToEl) {
      if (this.isEntranceOfRoom(entranceEl, roomData.roomEl)) {
        roomData.entranceId = entranceId
        roomData.entranceEl = entranceEl
        break // Найден вход, выходим из цикла
      }
    }
  }

  /**
   * Проверка, является ли вход входом в помещение
   */
  private isEntranceOfRoom(
    entranceEl: HTMLElement | SVGCircleElement,
    roomEl: HTMLElement | SVGPathElement | SVGRectElement
  ): boolean {
    const cx = Number(entranceEl.getAttribute('cx'))
    const cy = Number(entranceEl.getAttribute('cy'))
    const x = Number(roomEl.getAttribute('x'))
    const y = Number(roomEl.getAttribute('y'))
    const width = Number(roomEl.getAttribute('width'))
    const height = Number(roomEl.getAttribute('height'))
    return cx >= x && cx <= x + width && cy >= y && cy <= y + height
  }

  /**
   * Настройка обработчиков клика для помещений
   */
  private setupRoomClickHandlers() {
    for (const [, room] of this.rooms) {
      room.roomEl.addEventListener('click', () => {
        this.handleRoomClick(room)
      })
    }
  }

  /**
   * Выбор начального помещения
   */
  private selectInitialRoom() {
    const selectedRoomId = appStore().selectedRoomId
    if (selectedRoomId) {
      const room = this.rooms.get(selectedRoomId)
      if (room) this.toggleRoom(room, { activateRoom: true, activateEntrance: true })
    }
  }

  /**
   * Обработчик клика по помещению
   * @param room Модель помещения, по которому кликнули
   */
  private handleRoomClick(room: RoomModel) {
    //Если аудитории нет в таблице помещений, то она не выделяется (кроме режима разработчика)
    if (!dataStore().rooms.find((roomInfo: any) => roomInfo.id === room.roomId)) {
      appStore().toast.showForTime('К сожалению, мы пока не знаем, что здесь. Уже работаем над этим')
      if (userStore().isDevelopMode) {
        console.log(`Помещения с id ${room.roomId} нет в таблице помещений`)
      } else {
        return
      }
    }
    //Если есть активный маршрут, аудитория не выделяется
    if (appStore().queryService.steps) {
      return
    }
    if (appStore().selectedRoomId !== room.roomId) {
      appStore().changeSelectedRoom(room.roomId)
    } else {
      appStore().changeSelectedRoom(null)
    }
  }

  /**
   * Переключение подсветки помещения и кружочков входа
   * @param room Модель помещения, которое надо выделить, если надо выделить помещение
   * @param options `hideRooms` и `hideEntrances` - скрыть все помещения / кружочки входа, `activateRoom` и `activateEntrance` выделить переданное помещение / его кружочек входа
   */
  public toggleRoom(
    room: RoomModel | null,
    options: {
      activateRoom?: boolean
      hideRooms?: boolean
      activateEntrance?: boolean
      hideEntrances?: boolean
    }
  ) {
    if (options.hideRooms || options.hideEntrances) {
      for (const [, room] of this.rooms) {
        if (options.hideRooms) {
          room.roomEl.classList.remove(cl.selected)
        }
        if (options.hideEntrances && room.entranceEl) {
          room.entranceEl.classList.remove(cl.selected)
        }
      }
    }
    if (options.activateRoom && room) {
      room.roomEl.classList.add(cl.selected)
    }
    if (options.activateEntrance && room && room.entranceEl) {
      room.entranceEl.classList.add(cl.selected)
    }
  }

  /**
   * Метод, добавляющий класс хайлайта на переданное помещение, а также слушатель события клика для переключения плана на следующий в маршруте
   * @param room
   * @param last Последний ли это план в маршруте, если нет, добавляет слушатель на переключения плана на следующий в маршруте
   */
  public highlightRoomForNextStep(room: RoomModel | undefined, last: boolean) {
    if (!room) {
      console.log(`Попытка подсветить помещение, которого нет`, room)
      return
    }
    room.roomEl.classList.add(cl.highlight)
    if (!last) {
      const nextStepClickHandler = () => {
        appStore().queryService.nextStep()
      }
      room.roomEl.addEventListener('click', nextStepClickHandler)
      room.nextStepClickHandler = nextStepClickHandler
    }
  }

  /**
   * Метод, убирающий с текущего плана хайлайты и слушатели, т.е. удаляет добавленное в методе `highlightRoomForNextStep`
   */
  public deHighlightRoomsForNextStep() {
    this.rooms.forEach((room) => {
      room.roomEl.classList.remove(cl.highlight)
      if (room.nextStepClickHandler) {
        room.roomEl.removeEventListener('click', room.nextStepClickHandler)
      }
    })
  }

  // noinspection JSUnusedLocalSymbols
  // private testRoomsAndEntrances() {
  // 	console.log('ПОМЕЩЕНИЯ И ВХОДЫ');
  //
  // 	async function aue() {
  // 		const {rooms} = this;
  // 		for(const [roomId, roomData] of rooms) {
  // 			await wait(1000);
  // 			console.log(roomId);
  // 			roomData.roomEl.setAttribute('fill', '#3d9984');
  // 			roomData.roomEl.setAttribute('class', '');
  // 			roomData.entranceEl.setAttribute('fill', '#CE5757');
  // 			roomData.entranceEl.setAttribute('r', '20');
  // 			roomData.entranceEl.setAttribute('class', '');
  // 			console.log(roomData.roomEl);
  // 		}
  // 	}
  //
  // 	aue.bind(this)();
  // }
}
