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
	graph: unknown[]
	entrances: PlanEntrances[],
	corpus: CorpusData,

}

export type Id = string

type RoomId = Id
type CircleId = Id

export type PlanEntrances = [RoomId, CircleId]

export type RoomModel = {
	roomId: Id,
	roomEl: SVGRectElement | SVGPathElement,
	entranceId: Id,
	entranceEl: SVGCircleElement
};
