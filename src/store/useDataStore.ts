import {create} from 'zustand/react';
import {appStore} from './useAppStore.ts';
import {CorpusData, LocationData, PlanData, RoomData} from '../constants/types.ts';
import {appConfig} from '../appConfig.ts';
import {Graph} from "../models/Graph";
import {getDataFromServerAndParse} from '../models/data/getDataFromServerAndParse.ts'

type State = {
    /**
     * Хранит локации (кампусы)
     */
    locations: LocationData[];
    /**
     * Хранит корпусы с ссылками на локации
     */
    corpuses: CorpusData[];
    /**
     * Хранит планы с ссылками на корпусы
     */
    plans: PlanData[];
    /**
     * Хранит данные помещения с ссылкой на план
     */
    rooms: RoomData[];
    /**
     * Хранит граф
     */
    graph: Graph | null;
};

type Action = {
	init: () => void,
	setGraphForLocation: (location: LocationData) => void
}

export const useDataStore = create<State & Action>()((set, get) => ({
    locations: [],
    corpuses: [],
    plans: [],
    rooms: [],
    graph: null,

	init: () => {
		//TODO включить обратно

		getDataFromServerAndParse().then(data => {
			set({
				locations: data.locations,
				corpuses: data.corpuses,
				plans: data.plans,
				rooms: data.rooms,
			})

			//TODO: добавить сохранение плана в LS
			const firstPlan: PlanData | undefined = dataStore().plans.find(plan => plan.id === appConfig.firstPlan);
			if (!appStore().currentPlan && firstPlan) {
				appStore().changeCurrentPlan(firstPlan)
				const graphInitLocation = firstPlan.corpus.location;
				if(graphInitLocation) {
					dataStore().setGraphForLocation(graphInitLocation)
					// new Way('a-210', 'a-412')
				}
			}
		})
	},

    setGraphForLocation: (location: LocationData) => {
        set({ graph: new Graph(location) });
    },
}));

export function dataStore() {
    return useDataStore.getState();
}