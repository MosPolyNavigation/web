import {create} from 'zustand/react';
import axios from 'axios';
import {appStore, useAppStore} from './useAppStore.ts';
import {CorpusData, LocationData, PlanData, PlanEntrances} from '../associations/types.ts';
import {appConfig} from '../appConfig.ts';

// noinspection JSUnusedLocalSymbols
const address = 'https://mospolynavigation.github.io/polyna-preprocess/locations.json';

type State = {
	locations: LocationData[]
	corpuses: CorpusData[]
	plans: PlanData[]
}

type Action = {
	fetchData: () => void,
}

export const useDataStore = create<State & Action>()((set, get) => ({
	locations: [],
	corpuses: [],
	plans: [],

	fetchData: () => {
		//TODO включить обратно

		axios.get(address)
			.then(response => {
				const data: initialLocationData[] = response.data;
				fillData(data, get);
				console.log('Данные загружены с сервера');
			})
			.catch(e => {
				console.error('Не удалось загрузить данные с сервера', e);

				axios.get('/mpunav/data/mainData.json').then(response => {
					const data: initialLocationData[] = response.data;
					fillData(data, get);
					console.log('Данные загружены из приложения');
				})
			})
	},
}));


function fillData(data: initialLocationData[], get: () => (State & Action)) {
	data.forEach(inLocation => {
		const location: LocationData = {
			id: inLocation.id,
			title: inLocation.title,
			short: inLocation.short,
			address: inLocation.address,
			available: inLocation.available,
		};

		get().locations.push(location);

		if(location.available) {

			inLocation.corpuses?.forEach(inCorpus => {
				const corpus: CorpusData = {
					id: inCorpus.id,
					available: inCorpus.available,
					title: inCorpus.title,
					location: get().locations.find(location => location.id === inLocation.id),
				};

				get().corpuses.push(corpus);
				if(corpus.available) {
					inCorpus.plans?.forEach(inPlan => {
						const plan: PlanData = {
							id: inPlan.id,
							floor: parseInt(inPlan.floor),
							available: inPlan.available,
							wayToSvg: inPlan.wayToSvg,
							entrances: inPlan.entrances as PlanEntrances[],
							corpus: get().corpuses.find(corpus => corpus.id === inCorpus.id),
						};

						get().plans.push(plan);
					});
				}
			});
		}
	});
	if(!appStore().currentPlan) {
		appStore().changeCurrentPlan(get().plans.find(plan => plan.id === appConfig.firstPlan))
	}
}


type initialLocationData = {
	id: string
	title: string
	short: string
	available: boolean
	address: string
	corpuses?: initialCorpusData[]
	crossings?: string
}

type initialCorpusData = {
	id: string
	// locationID: string
	title: string
	available: boolean
	plans?: initialPlanData[]
	stairs?: string
}

type initialPlanData = {
	id: string
	// corpusID: string
	floor: string
	available: boolean
	wayToSvg: string
	graph: string
	entrances: string
}
