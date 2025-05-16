import { appStore } from "../store/useAppStore";
import { Step, Way } from "./Way.ts";
import chalk from "chalk";
import { dataStore } from "../store/useDataStore.ts";

/**
 * Класс, представляющий **Сервис выбора куда и откуда**, хранится в состоянии приложения и при задании новых "куда" и "откуда" начинает новый маршрут
 */
export class QueryService {
  from?: string; //Айди помещению "Отсюда"
  to?: string; //Айди помещению "Сюда"
  steps?: Step[];
  currentStepIndex?: number;
  fullDistance: number;
  userId: string | null;

  constructor(args?: {
    from?: string | null | Pointer.NOTHING;
    to?: string | null | Pointer.NOTHING;
    swap?: boolean;
    userId?: string | null;
  }) {
    this.userId = args?.userId || null;

    //Если инициализация или сброс куда откуда, то просто ставим null
    if (args) {
      const oldQueryService = appStore().queryService; //Предыдущий сервис, чтобы брать "откуда" и "куда" из него
      if (
        (args.from && args.from === oldQueryService.to) || //Если "куда" есть и совпадает со старым "откуда"
        (args.to && args.to === oldQueryService.from) || //или наоборот
        args.swap //Или если поменять местами 'куда' 'откуда'
      ) {
        this.swapFromOld(oldQueryService); //То сделать из поменянными местами
        this.userId = oldQueryService.userId;
      } else {
        //Иначе если есть куда и это не в "никуда", назначить откуда куда из конструктора, либо если там нулл то из старого
        if (args.from !== Pointer.NOTHING) {
          if (args.from) this.from = args.from;
          else this.from = oldQueryService.from;
        }
        if (args.to !== Pointer.NOTHING) {
          if (args.to) this.to = args.to;
          else this.to = oldQueryService.to;
        }
        if (!args.userId && oldQueryService) {
          this.userId = oldQueryService.userId;
        }
      }
    }

    // console.log(this.from, this.to)

    //Если нет текущего маршрута или у текущего маршрута не совпадают куда откуда с query-вскими
    //Если указано откуда и куда строить маршрут то построить новый маршрут и запомнить его
    if (this.to && this.from) {
      const { steps, fullDistance } = new Way(this.from, this.to, this.userId);
      this.steps = steps;
      this.currentStepIndex = 0;
      this.fullDistance = fullDistance;
      console.log(fullDistance);
      console.log(
        `Построен маршрут от ${chalk.underline(this.from)} до ${chalk.underline(
          this.to
        )} общей длиной ${chalk.bold(this.fullDistance)}`,
        this.steps
      );
      if (this.steps.length > 0) {
        const firstPlan = dataStore().plans.find(
          (plan) => plan === this.steps[0].plan
        );
        if (appStore().currentPlan !== firstPlan) {
          appStore().changeCurrentPlan(firstPlan);
        }
        // if(firstPlan)
        // useAppStore().changeCurrentPlan(dataStore().plans)
      }
      //то построить маршрут , а дальше посмотрим
    }
  }

  //Поменять местами из старых
  private swapFromOld(oldQueryService: QueryService) {
    this.to = oldQueryService.from;
    this.from = oldQueryService.to;
  }

  public nextStep() {
    this.currentStepIndex++;
    appStore().changeCurrentPlan(
      appStore().queryService.steps[this.currentStepIndex].plan
    );
  }

  previousStep() {
    this.currentStepIndex--;
    appStore().changeCurrentPlan(
      appStore().queryService.steps[this.currentStepIndex].plan
    );
  }
}

export enum Pointer {
  NOTHING = "NOTHING",
}
