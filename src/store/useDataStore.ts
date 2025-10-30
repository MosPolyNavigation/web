import { create } from 'zustand/react'
import { appStore } from './useAppStore.ts'
import { CorpusData, LocationData, PlanData, RoomData } from '../constants/types.ts'
import { appConfig } from '../appConfig.ts'
import { Graph } from '../models/Graph'
import { getDataFromServerAndParse } from '../models/data/getDataFromServerAndParse.ts'
import chalk from 'chalk'
import { QueryService } from '../models/QueryService'

type State = {
  /**
   * Хранит локации (кампусы)
   */
  locations: LocationData[]
  /**
   * Хранит корпусы с ссылками на локации
   */
  corpuses: CorpusData[]
  /**
   * Хранит планы с ссылками на корпусы
   */
  plans: PlanData[]
  /**
   * Хранит данные помещения с ссылкой на план
   */
  rooms: RoomData[]
  /**
   * Хранит граф
   */
  graph: Graph | null
}

type Action = {
  init: () => void
  setGraphForLocation: (location: LocationData) => void
}

export const useDataStore = create<State & Action>()((set, get) => ({
  locations: [],
  corpuses: [],
  plans: [],
  rooms: [],
  graph: null,

  init: () => {
    //TODO включить обратно

    getDataFromServerAndParse().then((data) => {
      set({
        locations: data.locations,
        corpuses: data.corpuses,
        plans: data.plans,
        rooms: data.rooms,
      })
      // @ts-expect-error TS2339
      window.data = {
        locations: data.locations,
        corpuses: data.corpuses,
        plans: data.plans,
        rooms: data.rooms,
      }

      let firstPlan: PlanData | undefined = dataStore().plans.find((plan) => plan.id === appConfig.firstPlan)
      const paramsString = window.location.search
      const searchParams = new URLSearchParams(paramsString)
      // Поддержка маршрута через ?from= & ?to= (нормализация ввода)
      const norm = (s?: string | null) => (s ? s.trim().toLowerCase() : undefined)
      const fromParamRaw = searchParams.get(appConfig.fromSearchParamName)
      const toParamRaw = searchParams.get(appConfig.toSearchParamName)
      const fromParam = norm(fromParamRaw)
      const toParam = norm(toParamRaw)
      const fromRoom = fromParam
        ? get().rooms.find((room) => room.id.toLowerCase() === fromParam)
        : undefined
      const toRoom = toParam
        ? get().rooms.find((room) => room.id.toLowerCase() === toParam)
        : undefined

      if (fromParam || toParam) {
        console.log(`Найдены параметры маршрута: from=${fromParam ?? '-'} to=${toParam ?? '-'}`)
        // Выбраем стартовый план: приоритет у from, иначе по to
        const planCandidate = (fromRoom?.plan ?? toRoom?.plan) ?? undefined
        if (planCandidate) firstPlan = planCandidate
      } else {
        // Поддержка прежнего поведения ?room=
        const roomIdSearchParamRaw = searchParams.get(appConfig.roomSearchParamName)
        const roomIdSearchParam = norm(roomIdSearchParamRaw)
        const roomFromSearchParam = roomIdSearchParam
          ? get().rooms.find((room) => room.id.toLowerCase() === roomIdSearchParam)
          : undefined
        if (roomIdSearchParam) {
          console.log(`Найден search параметр 'room'`)
          if (roomFromSearchParam) {
            console.log(
              chalk.green.bold(`Найдено помещение с id из search параметра 'room' ${chalk.underline(roomIdSearchParam)}`)
            )
            firstPlan = roomFromSearchParam.plan ?? undefined
          } else {
            console.log(
              chalk.red.bold(`Не найдено помещение с id из search параметра 'room' ${chalk.underline(roomIdSearchParam)}`)
            )
          }
        }
      }
      if (firstPlan) {
        appStore().changeCurrentPlan(firstPlan, true)
      } else {
        console.log(chalk.red('Не найден firstPlan для установки'))
      }
      // Пост-инициализационная логика по выбранным параметрам
      if (fromParam || toParam) {
        // Устанавливаем сервис маршрута согласно наличию параметров
        appStore().setQueryService(new QueryService({
          from: fromRoom?.id,
          to: toRoom?.id,
        }))
        // Если указан только один (from или to) — выделим это помещение как ориентир
        const singleRoom = fromRoom ?? toRoom
        if (singleRoom) {
          appStore().changeCurrentPlan(singleRoom.plan, true)
        }
      } else {
        const roomIdSearchParamRaw = searchParams.get(appConfig.roomSearchParamName)
        const roomIdSearchParam = norm(roomIdSearchParamRaw)
        const roomFromSearchParam = roomIdSearchParam
          ? get().rooms.find((room) => room.id.toLowerCase() === roomIdSearchParam)
          : undefined
        if (roomFromSearchParam) {
          appStore().changeCurrentPlan(roomFromSearchParam.plan, true)
          appStore().changeSelectedRoom(roomFromSearchParam.id)
        }
      }
      // const graphInitLocation = firstPlan.corpus.location
      // if (graphInitLocation) {
      //   dataStore().setGraphForLocation(graphInitLocation)
      //   // new Way('a-210', 'a-412')
      // }
    })
  },

  setGraphForLocation: (location: LocationData) => {
    set({ graph: new Graph(location) })
    console.log(`Установлен граф для локации ${get().graph?.location}`, get().graph)
  },
}))

export function dataStore() {
  return useDataStore.getState()
}
