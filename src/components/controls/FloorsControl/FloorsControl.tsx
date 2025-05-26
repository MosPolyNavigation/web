import { FC, useEffect, useMemo, useState } from 'react'
import cl from './FloorsControl.module.scss'
import classNames from 'classnames'
import { appStore, useAppStore } from '../../../store/useAppStore.ts'
import { getSortedPlansByCorpus } from '../../../functions/placesFunctions.ts'
import { PlanData } from '../../../constants/types.ts'
import { Layout } from '../../../constants/enums.ts'

const FloorsControl: FC = () => {
  const currentPlan = useAppStore((state) => state.currentPlan)
  const queryService = useAppStore((state) => state.queryService)
  const activeLayout = useAppStore((state) => state.activeLayout)

  const [floorsPlans, setFloorsPlans] = useState<PlanData[] | null>(null)

  useEffect(() => {
    if (currentPlan) {
      // Если нет этажей или (установлен план и корпус нынешних этажей не совпадает с корпусом только что установленного плана)
      if (!floorsPlans || currentPlan.corpus !== floorsPlans[0].corpus) {
        setFloorsPlans(getSortedPlansByCorpus(currentPlan.corpus))
      }
    }
  }, [currentPlan, floorsPlans])

  const circleOffsetStep = useMemo<number | undefined>(() => {
    if (currentPlan && floorsPlans) {
      return currentPlan.floor - floorsPlans[0].floor
    }
  }, [currentPlan, floorsPlans])

  function floorBtnHandler(plan: PlanData) {
    appStore().changeCurrentPlan(plan)
  }

  return (
    <div
      className={classNames(cl.floorControl, {
        [cl.invisible]: queryService.steps,
        [cl.bottomCardExpanded]: activeLayout === Layout.SEARCH,
      })}
      style={{
        // @ts-expect-error TS2353
        //Эта переменная указывает шаг отступа и используется в CSS для вычисления отступа
        '--floors-circle-offset-step': String(circleOffsetStep ?? 0),
      }}
    >
      {floorsPlans &&
        floorsPlans.map((plan: PlanData) => {
          const floorClasses = classNames(cl.floorNumber, { [cl.current]: plan === currentPlan })

          return (
            <button
              onClick={() => {
                floorBtnHandler(plan)
              }}
              className={floorClasses}
              key={plan.id}
            >
              {plan.floor}
            </button>
          )
        })}
      <div className={cl.circle}></div>
    </div>
  )
}

export default FloorsControl
