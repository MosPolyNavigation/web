import { appStore } from '../store/useAppStore'
import { Step, Way } from './Way.ts'
import chalk from 'chalk'
import { dataStore } from '../store/useDataStore.ts'
import axios from 'axios'
import { userStore } from '../store/useUserStore.ts'
import { statisticApi } from '../api/statisticApi.ts'

/**
 * Класс, представляющий **Сервис выбора куда и откуда**, хранится в состоянии приложения и при задании новых "куда" и "откуда" начинает новый маршрут
 */
export class QueryService {
  from?: string //Айди помещению "Отсюда"
  to?: string //Айди помещению "Сюда"
  steps?: Step[]
  currentStepIndex?: number
  fullDistance?: number

  constructor(args?: { from?: string | null | Pointer.NOTHING; to?: string | null | Pointer.NOTHING; swap?: boolean }) {
    this.initializeFromArgs(args)
    this.buildRouteIfNeeded()
  }

  /**
   * Инициализация параметров from и to из аргументов конструктора
   */
  private initializeFromArgs(args?: { from?: string | null | Pointer.NOTHING; to?: string | null | Pointer.NOTHING; swap?: boolean }) {
    if (!args) return

    const oldQueryService = appStore().queryService

    if (this.shouldSwap(args, oldQueryService)) {
      this.swapFromOld(oldQueryService)
    } else {
      this.assignFromArgs(args, oldQueryService)
    }
  }

  /**
   * Проверка, нужно ли поменять местами from и to
   */
  private shouldSwap(args: { from?: string | null | Pointer.NOTHING; to?: string | null | Pointer.NOTHING; swap?: boolean }, oldQueryService: QueryService): boolean {
    return (
      (args.from && args.from === oldQueryService.to) ||
      (args.to && args.to === oldQueryService.from) ||
      args.swap === true
    )
  }

  /**
   * Назначение значений from и to из аргументов
   */
  private assignFromArgs(args: { from?: string | null | Pointer.NOTHING; to?: string | null | Pointer.NOTHING; swap?: boolean }, oldQueryService: QueryService) {
    if (args.from !== Pointer.NOTHING) {
      this.from = args.from || oldQueryService.from
    }
    if (args.to !== Pointer.NOTHING) {
      this.to = args.to || oldQueryService.to
    }
  }

  /**
   * Построение маршрута, если указаны from и to
   */
  private buildRouteIfNeeded() {
    if (!this.to || !this.from) return

    try {
      const way = new Way(this.from, this.to)
      this.validateAndSetRoute(way)
      this.changeToFirstPlan()
    } catch (e) {
      this.handleRouteError(e)
    }
  }

  /**
   * Валидация и установка маршрута
   */
  private validateAndSetRoute(way: Way) {
    if (way.steps.length === 0 || isNaN(way.fullDistance)) {
      throw new Error(`Не удалось построить маршрут ${this.from} ${this.to}`)
    }

    void statisticApi.sendStartWay(this.from!, this.to!, true)
    this.steps = way.steps
    this.currentStepIndex = 0
    this.fullDistance = way.fullDistance

    console.log(
      `Построен маршрут от ${chalk.underline(this.from)} до ${chalk.underline(this.to)} общей длиной ${chalk.bold(this.fullDistance)}`,
      this.steps
    )
  }

  /**
   * Переход к первому плану маршрута
   */
  private changeToFirstPlan() {
    if (this.steps && this.steps.length > 0) {
      const firstPlan = dataStore().plans.find((plan) => plan === this.steps![0].plan)
      if (appStore().currentPlan !== firstPlan && firstPlan) {
        appStore().changeCurrentPlan(firstPlan)
      }
    }
  }

  /**
   * Обработка ошибки построения маршрута
   */
  private handleRouteError(error: any) {
    console.error(error)
    void statisticApi.sendStartWay(this.from!, this.to!, false)
    appStore().toast.showForTime('К сожалению, не удалось построить маршрут')
    this.from = undefined
    this.to = undefined
  }

  //Поменять местами из старых
  private swapFromOld(oldQueryService: QueryService) {
    this.to = oldQueryService.from
    this.from = oldQueryService.to
  }

  public nextStep() {
    if (typeof this.currentStepIndex !== 'number' || !this.steps) return
    this.currentStepIndex++
    appStore().changeCurrentPlan(this.steps[this.currentStepIndex].plan)
  }

  previousStep() {
    if (typeof this.currentStepIndex !== 'number' || !this.steps) return
    this.currentStepIndex--
    appStore().changeCurrentPlan(this.steps[this.currentStepIndex].plan)
  }
}

export enum Pointer {
  NOTHING = 'NOTHING',
}
