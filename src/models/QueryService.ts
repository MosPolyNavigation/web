import {appStore} from "../store/useAppStore";
import {Way} from "./Way.ts";
import chalk from "chalk";
import {dataStore} from "../store/useDataStore.ts";

/**
 * Класс, представляющий **Сервис выбора куда и откуда**, хранится в состоянии приложения и при задании новых "куда" и "откуда" начинает новый маршрут
 */
export class QueryService {
	from: string | null //Айди помещению "Отсюда"
	to: string | null //Айди помещению "Сюда"
	way: Way | null

	constructor(args?: { from?: string | null | Pointer.NOTHING, to?: string | null | Pointer.NOTHING, swap?: boolean}) {
		//Если инициализация или сброс куда откуда, то просто ставим null
		this.from = null
		this.to = null
		this.way = null

		if(args) {

		const oldQueryService = appStore().query //Предыдущий сервис, чтобы брать "откуда" и "куда" из него
		if (args.from && args.from === oldQueryService.to //Если "куда" есть и совпадает со старым "откуда"
			|| args.to && args.to === oldQueryService.from //или наоборот
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

		// console.log(this.from, this.to)

		//Если нет текущего маршрута или у текущего маршрута не совпадают куда откуда с query-вскими
		//Если указано откуда и куда строить маршрут то построить новый маршрут и запомнить его
		if (this.to && this.from) {
			this.way = new Way(this.from, this.to)
			console.log(`Построен маршрут от ${chalk.underline(this.from)} до ${chalk.underline(this.to)}: `, this.way)
			if(this.way.steps.length > 0) {
				const firstPlan = dataStore().plans.find(plan => plan === this.way.steps[0].plan)
				if(appStore().currentPlan !== firstPlan) {
					appStore().changeCurrentPlan(firstPlan)
				}
				// if(firstPlan)
				console.log(firstPlan)
				// useAppStore().changeCurrentPlan(dataStore().plans)
			}
			//то построить маршрут , а дальше посмотрим
		}
	}

	//Поменять местами из старых
	private swapFromOld(oldQueryService: QueryService) {
		this.to = oldQueryService.from
		this.from = oldQueryService.to
	}
}

export enum Pointer {
	NOTHING = 'NOTHING'
}