import axios from 'axios'
import { DataDto } from './types/dto.ts'
import { CorpusData, LocationData, PlanData, RoomData } from '../../constants/types.ts'
import { Parser } from '../Parser.ts'
import { appConfig } from '../../appConfig.ts'

const LS_DATA_KEY = 'data-v1'

export async function getDataFromServerAndParse({ source }: { source: 'server' | 'ls' }) {
  let data: DataDto = {
    plans: [],
    rooms: [],
    corpuses: [],
    locations: [],
  }

  let locations: LocationData[] = []
  let corpuses: CorpusData[] = []
  let plans: PlanData[] = []
  let rooms: RoomData[] = []

  try {
    if (source === 'ls') {
      const fromLS = localStorage.getItem(LS_DATA_KEY)
      if (!fromLS) throw new Error('Нет сохраненных данных')
      data = JSON.parse(fromLS) as DataDto
    } else {
      data = (await axios.get<DataDto>(appConfig.dataUrl)).data
      if (data) localStorage.setItem(LS_DATA_KEY, JSON.stringify(data))
    }

    console.log(`Данные загружены с ${source}`)

    locations = data.locations.map((locDto) => ({
      id: locDto.id,
      title: locDto.title,
      short: locDto.short,
      address: locDto.address,
      available: locDto.available,
      crossings: locDto.crossings ?? [],
    }))

    corpuses = data.corpuses.map((corpDto) => ({
      id: corpDto.id,
      location: locations.find((loc) => loc.id === corpDto.locationId) as LocationData,
      title: corpDto.title,
      available: corpDto.available,
      stairs: corpDto.stairs ?? [],
    }))

    plans = data.plans.map((planDto) => ({
      id: planDto.id,
      corpus: corpuses.find((corpus) => corpus.id === planDto.corpusId) as CorpusData,
      available: planDto.available,
      wayToSvg: planDto.wayToSvg,
      graph: planDto.graph,
      floor: parseInt(planDto.floor) ?? 0,
      entrances: planDto.entrances,
    }))

    rooms = data.rooms
      .map((roomDto) => {
        const plan = plans.find((plan) => plan.id === roomDto.planId)
        if (plan) return Parser.fillRoomData(roomDto, plan)
        else return null
      })
      .filter((room) => !!room)
  } catch (e) {
    console.log(e, 'Не удалось загрузить данные с сервера')
  }
  return { locations, corpuses, plans, rooms }
}
