import { create } from 'zustand/react'
import { appStore } from './useAppStore.ts'
import { CorpusData, LocationData, PlanData, RoomData } from '../constants/types.ts'
import { appConfig } from '../appConfig.ts'
import { Graph } from '../models/Graph'
import { getDataFromServerAndParse } from '../models/data/getDataFromServerAndParse.ts'
import chalk from 'chalk'

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
      const roomIdSearchParam = searchParams.get(appConfig.roomSearchParamName)
      const roomFromSearchParam = get().rooms.find((room) => room.id === roomIdSearchParam)
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
      if (firstPlan) {
        appStore().changeCurrentPlan(firstPlan, true)
      } else {
        console.log(chalk.red('Не найден firstPlan для установки'))
      }
      if (roomFromSearchParam) {
        appStore().changeCurrentPlan(roomFromSearchParam.plan, true)
        appStore().changeSelectedRoom(roomFromSearchParam.id)
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
