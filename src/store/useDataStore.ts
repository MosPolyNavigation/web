import {create} from 'zustand/react';
import axios from 'axios';
import {appStore} from './useAppStore.ts';
import {CorpusData, LocationData, PlanData} from '../associations/types.ts';
import {appConfig} from '../appConfig.ts';
import {Graph} from "../models/Graph";

const address = 'https://mospolynavigation.github.io/polyna-preprocess/locations.json';

type State = {
	/**
	 * Хранит локации (кампусы)
	 */
	locations: LocationData[]
	/**
	 * Хранит корпусы с ссылками на локации
	 */
	corpuses: CorpusData[]
	/**
	 * Хранит планы с ссылками на корпусы
	 */
	plans: PlanData[]
	/**
	 * Хранит граф
	 */
	graph: Graph | null
}

type Action = {
	fetchData: () => void,
	setGraphForLocation: (location: LocationData) => void
}

export const useDataStore = create<State & Action>()((set, get) => ({
	locations: [],
	corpuses: [],
	plans: [],
	graph: null,

	fetchData: () => {
		//TODO включить обратно

		axios.get(address)
			.then(response => {
				const data: initialLocationData[] = response.data;
				console.log('Данные загружены с сервера');
				fillData(data);
			})
			.catch(e => {
				console.error('Не удалось загрузить данные с сервера', e);

				axios.get('/mpunav/data/mainData.json').then(response => {
					const data: initialLocationData[] = response.data;
					console.log('Данные загружены из приложения');
					fillData(data);
				})
			})
	},

	setGraphForLocation: (location: LocationData) => {
		set({graph: new Graph(location)})
	}
}));

export function dataStore() {
	return useDataStore.getState()
}


function fillData(data: initialLocationData[]) {
	console.log('Начинается обработка загруженных данных')
	data.forEach(inLocation => {
		const location: LocationData = {
			id: inLocation.id,
			title: inLocation.title,
			short: inLocation.short,
			address: inLocation.address,
			available: inLocation.available,
			crossings: inLocation.crossings ?? []
		};

		dataStore().locations.push(location);

		if (location.available) {

			inLocation.corpuses?.forEach(inCorpus => {
				const corpus: CorpusData = {
					id: inCorpus.id,
					available: inCorpus.available,
					title: inCorpus.title,
					location: dataStore().locations.find(location => location.id === inLocation.id) as LocationData,
					stairs: inCorpus.stairs ?? []
				};

				dataStore().corpuses.push(corpus);
				if (corpus.available) {
					inCorpus.plans?.forEach(inPlan => {
						const plan: PlanData = {
							id: inPlan.id,
							floor: parseInt(inPlan.floor),
							available: inPlan.available,
							wayToSvg: inPlan.wayToSvg,
							graph: inPlan.graph ?? [],
							entrances: inPlan.entrances ?? [],
							corpus: dataStore().corpuses.find(corpus => corpus.id === inCorpus.id) as CorpusData,
						};

						dataStore().plans.push(plan);
					});
				}
			});
		}
	});
	const firstPlan: PlanData | undefined = dataStore().plans.find(plan => plan.id === appConfig.firstPlan);
	if (!appStore().currentPlan && firstPlan) {
		appStore().changeCurrentPlan(firstPlan)
		const graphInitLocation = firstPlan.corpus.location;
		if(graphInitLocation) {
			dataStore().setGraphForLocation(graphInitLocation)
			// new Way('a-210', 'a-412')
		}
	}
	console.log('Данные заполнены', {
		locations: dataStore().locations,
		corpuses: dataStore().corpuses,
		plans: dataStore().plans
	})
}


type initialLocationData = {
	id: string
	title: string
	short: string
	available: boolean
	address: string
	corpuses?: initialCorpusData[]
	crossings?: Array<[string, string, number]>
}

type initialCorpusData = {
	id: string
	title: string
	available: boolean
	plans?: initialPlanData[]
	stairs?: Array<string[]>
}

type initialPlanData = {
	id: string
	floor: string
	available: boolean
	wayToSvg: string
	graph?: RawVertex[]
	entrances: Array<[string, string]>
}

export type RawVertex = {
	id: string
	x: number
	y: number
	type: string
	neighborData: Array<[string, number]>
}