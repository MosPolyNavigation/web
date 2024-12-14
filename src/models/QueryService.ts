import {appStore} from "../store/useAppStore";

export class QueryService {
	from: string | null //Айди помещению "Отсюда"

	to: string | null //Айди помещению "Сюда"

	constructor(args?: { from?: string | null | Pointer.NOTHING, to?: string | null | Pointer.NOTHING, swap?: boolean}) {
		//Если инициализация или сброс куда откуда, то просто ставим null
		this.from = null
		this.to = null

		if(args) {

		const oldQueryService = appStore().query //Старый сервис, чтобы брать откуда куда из него
		if (args.from && args.from === oldQueryService.to //Если "куда" есть и совпадает со старым "откуда"
			|| args.to && args.to === oldQueryService.from
			|| args.swap //Или если поменять местами 'куда' 'откуда'
		) {
			this.swapFromOld(oldQueryService) //То сделать из поменянными местами
		} else {
			//Иначе если есть куда и это не в "никуда", назначить откуда куда из конструктора, либо если там нулл то из старого
			if(args.from && args.from !== Pointer.NOTHING) this.from = args.from
			else this.from = oldQueryService.from
			if(args.to && args.to !== Pointer.NOTHING) this.to = args.to
			else this.to = oldQueryService.to
		}
		}

		console.log(this.from, this.to)

		//Если нет текущего маршрута или у текущего маршрута не совпадают куда откуда с query-вскими
		if (this.to && this.from) {
			//то построить маршрут , а дальше посмотрим
		}
	}

	private swapFromOld(oldQueryService: QueryService) {
		this.to = oldQueryService.from
		this.from = oldQueryService.to
	}
}

export enum Pointer {
	NOTHING = 'NOTHING'
}