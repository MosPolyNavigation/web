import { create } from 'zustand'
import { BtnName, Layout, SearchIndent } from '../constants/enums.ts'

import { PlanData, RoomModel } from '../constants/types.ts'
import { PlanModel } from '../models/Plan/PlanModel.ts'
import { QueryService } from '../models/QueryService'
import chalk from 'chalk'
import { Toast } from '../models/Toast.ts'
import { dataStore } from './useDataStore.ts'
import { statisticApi } from '../api/statisticApi.ts'
import { appConfig } from '../appConfig.ts'

type State = {
  /**
   * Хранит текущий слой приложения: план, экран локаций, поиск, меню и т.д.
   */
  activeLayout: Layout
  previousLayout: Layout
  /**
   * Хранит id выбранного (выделенного) помещения
   */
  selectedRoomId: null | string
  /**
   * Хранит текущий план и его данные в виде объекта `PlanData`
   */
  currentPlan: null | PlanData
  previousPlan: PlanData | null
  /**
   * Хранит Модель текущего плана, его SVG и помещения.
   * Получается из `currentPlan` и изображения плана.
   * Нужно для **взаимодействия с SVG** плана
   */
  planModel: null | PlanModel
  /**
   * Сервис выбора помещений и маршрута
   * Хранит id "Куда" и "Откуда", а также построенный маршрут
   */
  queryService: QueryService
  /**
   *
   */
  searchQuery: string
  /**
   *
   */
  searchIndent: SearchIndent
  /** Функции изменения масштаба */
  controlsFunctions: null | { zoomIn: () => void; zoomOut: () => void }
  /** Угол поворота карты в градусах */
  rotationAngle: number
  /**  */
  toast: Toast
  /** Флаг закрытия плашки поиска для синхронизации с инпутом */
  isSearchPanelClosing: boolean
  /** Смещение плашки во время драга для синхронизации движения инпута */
  bottomLayerTranslateY: number
}

type Action = {
  /**
   * Выбрать (выделить) помещение, влияет на подсветку помещения и состояние приложения `selectedRoomId`, а также на отображение нижней карточки с инфо о помещении
   * @param roomId id помещения, которое надо выбрать, или `null`, чтобы снять выделение
   */
  changeSelectedRoom: (roomId: null | string) => void
  /**
   *
   * @param btnName
   */
  controlBtnClickHandler: (btnName: BtnName) => void
  changeLayout: (layout: Layout) => void
  changeCurrentPlan: (plan: PlanData | null, first?: boolean) => void
  changePlanModel: (planInf: PlanData, planSvgEl: SVGSVGElement, virtualSvg: SVGSVGElement | HTMLElement) => void
  setQueryService: (query: QueryService, updateUrl?: boolean) => void
  setSearchQuery: (newSearchQuery: string) => void
  setSearchIndent: (searchIndent: SearchIndent) => void
  setControlsFunctions: (functions: { zoomIn: () => void; zoomOut: () => void }) => void
  setRotationAngle: (angle: number) => void
  setSearchPanelClosing: (isClosing: boolean) => void
  setBottomLayerTranslateY: (translateY: number) => void
}

export function appStore() {
  return useAppStore.getState()
}

export const useAppStore = create<State & Action>()((set, get) => ({
  activeLayout: Layout.PLAN,
  previousLayout: Layout.PLAN,
  currentPlan: null,
  previousPlan: null,
  selectedRoomId: null,
  planModel: null,
  updateState: {},
  queryService: new QueryService(),
  searchQuery: '',
  searchIndent: SearchIndent.SELECT,
  controlsFunctions: null,
  rotationAngle: 0,
  toast: new Toast(),
  isSearchPanelClosing: false,
  bottomLayerTranslateY: 0,

  controlBtnClickHandler: (btnName) => {
    const activeLayout = get().activeLayout
    if (btnName === BtnName.MENU && activeLayout === Layout.PLAN) {
      get().changeLayout(Layout.MENU)
    } //Показать левое меню
    else if (btnName === BtnName.MENU_CLOSE && activeLayout === Layout.MENU) {
      get().changeLayout(Layout.PLAN)
    } //Скрыть левое меню
    else if (btnName === BtnName.BOTTOM_RIGHT) {
      if (activeLayout === Layout.PLAN) {
        get().changeSelectedRoom(null)
        get().changeLayout(Layout.LOCATIONS)
      } else if (activeLayout === Layout.LOCATIONS) get().changeLayout(Layout.PLAN)
      else if (activeLayout === Layout.SEARCH) get().changeLayout(get().previousLayout)
    } //Показать левое меню
    else if (btnName === BtnName.SEARCH && activeLayout !== Layout.SEARCH) {
      get().setSearchIndent(SearchIndent.SELECT)
      get().changeLayout(Layout.SEARCH)
      get().setSearchQuery('')
    } //Скрыть левое меню
  },

  changeSelectedRoom: (roomId: string | null) => {
    console.log(roomId)
    if (get().selectedRoomId !== roomId) {
      set({ selectedRoomId: roomId })
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      if (roomId) {
        void statisticApi.sendSelectRoom(roomId, true)
        params.set(appConfig.roomSearchParamName, roomId)
      } else {
        params.delete(appConfig.roomSearchParamName)
      }
      window.history.replaceState(null, '', `${url.pathname}?${params.toString()}`)
      const planModel = get().planModel
      if (planModel) {
        planModel.toggleRoom(null, { hideRooms: true, hideEntrances: true })
        if (roomId) {
          const room = planModel.rooms.get(roomId)
          if (room) {
            planModel.toggleRoom(room, { activateRoom: true, activateEntrance: true })
          }
        }
      }
    }

    // if (get().selectedRoomId) console.log(`Выбрано помещение ${chalk.underline(get().selectedRoomId)}`)
    // else console.log(`Снят выбор помещения`)
  },

  changeCurrentPlan: (plan, first) => {
    if (get().currentPlan !== plan && plan) {
      appStore().changeSelectedRoom(null)
      set({ previousPlan: get().currentPlan })
      set({ currentPlan: plan })
      console.log(`План изменен на ${chalk.underline(plan.id)}`)
      void statisticApi.sendChangePlan(plan.id, first)
      //При смене локации заполняем новый граф
      // if (plan.corpus.location !== dataStore().graph?.location && dataStore().graph)
      // Посмотреть в перспективе нао ли это
      if (plan.corpus.location !== dataStore().graph?.location) dataStore().setGraphForLocation(plan.corpus.location)
    }
  },

  changeLayout: (layout) => {
    if (layout !== get().activeLayout) {
      // console.log(`Слой изменён на: %c${layout}}`, 'font-weight: bold;');
      set({ previousLayout: get().activeLayout })
      set({ activeLayout: layout })
    }
  },

  changePlanModel: (planInf, planSvgEl, virtualSvg) => {
    set({ planModel: new PlanModel(planInf, planSvgEl, virtualSvg) })
  },

  setQueryService: (query, updateUrl = false) => {
    appStore().planModel?.deHighlightRoomsForNextStep() //Снятие старых хайлайтов и слушателей на смену плана
    set({ queryService: query })

    // Обновляем URL только если явно указано (например, при загрузке из квери-параметров)
    // При ручном создании маршрута (updateUrl = false по умолчанию) URL не обновляется
    if (updateUrl) {
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      if (query.from) params.set(appConfig.fromSearchParamName, query.from)
      else params.delete(appConfig.fromSearchParamName)
      if (query.to) params.set(appConfig.toSearchParamName, query.to)
      else params.delete(appConfig.toSearchParamName)
      // Если есть хотя бы один из from/to — удаляем одиночный room
      if (query.from || query.to) params.delete(appConfig.roomSearchParamName)
      // Если оба отсутствуют — просто чистим from/to
      window.history.replaceState(null, '', `${url.pathname}?${params.toString()}`)
    }

    // Подсветка помещения при частичных параметрах (только from или только to)
    const planModel = get().planModel
    const singleId = query.from && !query.to ? query.from : !query.from && query.to ? query.to : undefined
    if (planModel) {
      planModel.toggleRoom(null, { hideRooms: true, hideEntrances: true })
      if (singleId) {
        const room = planModel.rooms.get(singleId)
        if (room) {
          planModel.toggleRoom(room, { activateRoom: true, activateEntrance: true })
        }
      }
    }
  },
  setSearchQuery: (newSearchQuery) => {
    set({ searchQuery: newSearchQuery })
  },
  setSearchIndent: (searchIndent) => {
    set({ searchIndent: searchIndent })
  },
  setControlsFunctions: (functions) => {
    set({ controlsFunctions: functions })
  },
  setRotationAngle: (angle) => {
    set({ rotationAngle: angle })
  },
  setSearchPanelClosing: (isClosing) => {
    set({ isSearchPanelClosing: isClosing })
  },
  setBottomLayerTranslateY: (translateY) => {
    set({ bottomLayerTranslateY: translateY })
  },
}))
