import {appStore} from "../store/useAppStore";
import {Step, Way} from "./Way.ts";
import chalk from "chalk";
import {dataStore} from "../store/useDataStore.ts";
import axios from 'axios'
import {userStore} from '../store/useUserStore.ts'
import {statisticApi} from '../api/statisticApi.ts'

/**
 * Класс, представляющий **Сервис выбора куда и откуда**, хранится в состоянии приложения и при задании новых "куда" и "откуда" начинает новый маршрут
 */
export class QueryService {
	from?: string//Айди помещению "Отсюда"
	to?: string//Айди помещению "Сюда"
	steps?: Step[]
	currentStepIndex?: number
	fullDistance?: number;

	constructor(args?: { from?: string | null | Pointer.NOTHING, to?: string | null | Pointer.NOTHING, swap?: boolean}) {
		//Если инициализация или сброс куда откуда, то просто ставим null

		if(args) {

		const oldQueryService = appStore().queryService //Предыдущий сервис, чтобы брать "откуда" и "куда" из него
		if (args.from && args.from === oldQueryService.to //Если "куда" есть и совпадает со старым "откуда"
			|| args.to && args.to === oldQueryService.from //или наоборот
			|| args.swap //Или если поменять местами 'куда' 'откуда'
		) {
			this.swapFromOld(oldQueryService) //То сделать из поменянными местами
		} else {
			//Иначе если есть куда и это не в "никуда", назначить откуда куда из конструктора, либо если там нулл то из старого
			if(args.from !== Pointer.NOTHING) {
				if(args.from) this.from = args.from
				else this.from = oldQueryService.from
			}
			if(args.to !== Pointer.NOTHING) {
				if(args.to) this.to = args.to
				else this.to = oldQueryService.to
			}
		}
		}

		// console.log(this.from, this.to)

		//Если нет текущего маршрута или у текущего маршрута не совпадают куда откуда с query-вскими
		//Если указано откуда и куда строить маршрут то построить новый маршрут и запомнить его
		if (this.to && this.from) {
			try {
				const {steps, fullDistance} = new Way(this.from, this.to)
				void statisticApi.sendStartWay(this.from, this.to, true)
				this.steps = steps
				this.currentStepIndex = 0
				this.fullDistance = fullDistance
				console.log(steps, fullDistance)
				console.log(`Построен маршрут от ${chalk.underline(this.from)} до ${chalk.underline(this.to)} общей длиной ${chalk.bold(this.fullDistance)}`, this.steps)
				if(this.steps.length > 0) {
					const firstPlan = dataStore().plans.find(plan => plan === steps[0].plan)
					if(appStore().currentPlan !== firstPlan && firstPlan) {
						appStore().changeCurrentPlan(firstPlan)
					}
					// if(firstPlan)
					// useAppStore().changeCurrentPlan(dataStore().plans)
				}
			} catch (e) {
				console.error(e)
				void statisticApi.sendStartWay(this.from, this.to, false)
				appStore().toast.showForTime('К сожалению, не удалось построить маршрут')
			}
		}
	}

	//Поменять местами из старых
	private swapFromOld(oldQueryService: QueryService) {
		this.to = oldQueryService.from
		this.from = oldQueryService.to
	}

	 public nextStep() {
		if(typeof this.currentStepIndex !== 'number' || !this.steps) return
		 this.currentStepIndex++
		 appStore().changeCurrentPlan(
			 this.steps[this.currentStepIndex].plan
		 )
	 }

	previousStep() {
		if(typeof this.currentStepIndex !== 'number' || !this.steps) return
		this.currentStepIndex--
		appStore().changeCurrentPlan(
			this.steps[this.currentStepIndex].plan
		)
	}
}

export enum Pointer {
	NOTHING = 'NOTHING'
}