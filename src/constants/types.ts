import {IconLink} from './IconLink.ts'
import {GraphRecordDto} from '../models/data/types/dto.ts'

export type LocationData = {
	id: string
	title: string
	short: string
	available: boolean
	address: string,
	crossings: Array<[string, string, number]>
}

export type CorpusData = {
	id: string,
	title: string,
	available: boolean,
	location: LocationData,
	stairs: Array<string[]>
}

export type PlanData = {
	id: string,
	floor: number,
	available: boolean,
	wayToSvg: string,
	graph: GraphRecordDto[]
	entrances: PlanEntrances[],
	corpus: CorpusData,
}

export type RoomData = {
	id: string,
	type: RoomType,
	available: boolean,
	title: string,
	subTitle: string,
	icon: IconLink | null,
	plan: PlanData | null
}

export type RoomType = string | null | 'Пока не известно' | 'Лифт' | 'Лестница' | 'Переход между корпусами' | 'Учебная аудитория' | 'Лекторий' | 'Лаборатория' | 'Общественное пространство / актовый или концертный зал' | 'Коворкинг' | 'Администрация' | 'Вход в здание' | 'Приёмная комиссия' | 'Женский туалет' | 'Мужской туалет' | 'Общий туалет' | 'Столовая / кафе' | 'Библиотека / читальный зал' | 'Клуб / секция / внеучебка' | 'Спортивный зал' | 'Гардероб / раздевалка' | 'Не используется' | 'Служебное помещение'


export type Id = string

type RoomId = Id
type CircleId = Id

export type PlanEntrances = [RoomId, CircleId]

export type RoomModel = {
	roomId: Id
	roomEl: SVGRectElement | SVGPathElement
	entranceId: Id
	entranceEl?: SVGCircleElement
	/**
	 * Слушатели события на клик для переключения на следующий план в маршруте
	 */
	nextStepClickHandler?: () => void
};
