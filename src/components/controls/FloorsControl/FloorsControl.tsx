import {FC, useEffect, useMemo, useState} from 'react';
import cl from './FloorsControl.module.scss';
import classNames from 'classnames';
import {appStore, useAppStore} from '../../../store/useAppStore.ts';
import {getSortedPlansByCorpus} from '../../../functions/placesFunctions.ts';
import {PlanData} from '../../../constants/types.ts';

const FloorsControl: FC = () => {
	const currentPlan = useAppStore(state => state.currentPlan);
	const queryService = useAppStore(state => state.queryService);

	const [floorsPlans, setFloorsPlans] = useState<PlanData[] | null>(null);

	useEffect(() => {
		if(currentPlan) {
			// Если нет этажей или (установлен план и корпус нынешних этажей не совпадает с корпусом только что установленного плана)
			if(!floorsPlans || currentPlan.corpus !== floorsPlans[0].corpus) {
				setFloorsPlans(getSortedPlansByCorpus(currentPlan.corpus));
			}
		}
	}, [currentPlan, floorsPlans]);

	const circleOffsetStep = useMemo<number | undefined>(() => {
		if(currentPlan && floorsPlans) {
			return currentPlan.floor - floorsPlans[0].floor;
		}
	}, [currentPlan, floorsPlans]);

	const circleClasses = classNames(cl.circle, {
		[cl.floor0]: circleOffsetStep === 0,
		[cl.floor1]: circleOffsetStep === 1,
		[cl.floor2]: circleOffsetStep === 2,
		[cl.floor3]: circleOffsetStep === 3,
		[cl.floor4]: circleOffsetStep === 4,
		[cl.floor5]: circleOffsetStep === 5,
		[cl.floor6]: circleOffsetStep === 6,
	});


	function floorBtnHandler(plan: PlanData) {
		appStore().changeCurrentPlan(plan)
	}


	return (
		<div className={classNames(cl.floorControl, {
			[cl.invisible]: queryService.steps
		})}>
			{floorsPlans &&
				floorsPlans.map((plan: PlanData) => {
					const floorClasses = classNames(cl.floorNumber, {[cl.current]: (plan === currentPlan)});

					return (
						<button onClick={() => {floorBtnHandler(plan)}} className={floorClasses} key={plan.id}>{plan.floor}</button>
					);
				})
			}
			<div className={circleClasses}></div>
		</div>
	);
};

export default FloorsControl;
