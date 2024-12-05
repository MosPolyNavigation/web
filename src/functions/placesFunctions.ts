import {CorpusData, PlanData} from '../associations/types.ts';
import {useDataStore} from '../store/useDataStore.ts';

export function getBottomFloorPlan(corpus: CorpusData): PlanData {
	return getSortedPlansByCorpus(corpus)[0]
}

export function getSortedPlansByCorpus(corpus: CorpusData): PlanData[]{
	const plans = useDataStore.getState().plans
	return [...plans.filter(plan => plan.corpus === corpus).sort((a, b) => a.floor - b.floor)]
}
