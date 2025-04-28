import { create } from "zustand";
import axios from "axios";
import { appStore } from "./useAppStore.ts";
import {
    CorpusData,
    LocationData,
    PlanData,
    RoomData,
} from "../constants/types.ts";
import { appConfig } from "../appConfig.ts";
import { Graph } from "../models/Graph";
import { Parser } from "../models/Parser.ts";

const address =
    "https://mospolynavigation.github.io/polyna-preprocess/locations.json";

type State = {
    locations: LocationData[];
    corpuses: CorpusData[];
    plans: PlanData[];
    rooms: RoomData[];
    graph: Graph | null;
};

type Action = {
    fetchData: () => void;
    setGraphForLocation: (location: LocationData) => void;
};

export const useDataStore = create<State & Action>()((set, get) => ({
    locations: [],
    corpuses: [],
    plans: [],
    rooms: [],
    graph: null,

    fetchData: () => {
        axios
            .get(address)
            .then((response) => {
                const data: initialLocationData[] = response.data;
                console.log("Данные загружены с сервера");
                fillData(data, set);
            })
            .catch((e) => {
                console.error("Не удалось загрузить данные с сервера", e);

                axios.get("/mpunav/data/mainData.json").then((response) => {
                    const data: initialLocationData[] = response.data;
                    console.log("Данные загружены из приложения");
                    fillData(data, set);
                });
            });
    },

    setGraphForLocation: (location: LocationData) => {
        set({ graph: new Graph(location) });
    },
}));

export function dataStore() {
    return useDataStore.getState();
}

function fillData(data: initialLocationData[], set) {
    console.log("Начинается обработка загруженных данных");

    const locations: LocationData[] = [];
    const corpuses: CorpusData[] = [];
    const plans: PlanData[] = [];
    const rooms: RoomData[] = [];

    data.forEach((inLocation) => {
        const location: LocationData = {
            id: inLocation.id,
            title: inLocation.title,
            short: inLocation.short,
            address: inLocation.address,
            available: inLocation.available,
            crossings: inLocation.crossings ?? [],
        };
        locations.push(location);

        if (location.available) {
            inLocation.corpuses?.forEach((inCorpus) => {
                const corpus: CorpusData = {
                    id: inCorpus.id,
                    available: inCorpus.available,
                    title: inCorpus.title,
                    location: location,
                    stairs: inCorpus.stairs ?? [],
                };
                corpuses.push(corpus);

                if (corpus.available) {
                    inCorpus.plans?.forEach((inPlan) => {
                        const plan: PlanData = {
                            id: inPlan.id,
                            floor: parseInt(inPlan.floor),
                            available: inPlan.available,
                            wayToSvg: inPlan.wayToSvg,
                            graph: inPlan.graph ?? [],
                            entrances: inPlan.entrances ?? [],
                            corpus: corpus,
                        };
                        plans.push(plan);

                        inPlan.rooms?.forEach((inRoom) => {
                            const room = Parser.fillRoomData(inRoom, plan);
                            if (room) rooms.push(room);
                        });
                    });
                }
            });
        }
    });

    set({
        locations,
        corpuses,
        plans,
        rooms,
    });

    const firstPlan: PlanData | undefined = plans.find(
        (plan) => plan.id === appConfig.firstPlan
    );
    if (!appStore().currentPlan && firstPlan) {
        appStore().changeCurrentPlan(firstPlan);
        const graphInitLocation = firstPlan.corpus.location;
        if (graphInitLocation) {
            set({ graph: new Graph(graphInitLocation) });
        }
    }

    console.log("Данные заполнены", {
        locations,
        corpuses,
        plans,
        rooms,
    });
}

type initialLocationData = {
    id: string;
    title: string;
    short: string;
    available: boolean;
    address: string;
    corpuses?: initialCorpusData[];
    crossings?: Array<[string, string, number]>;
};
type initialCorpusData = {
    id: string;
    title: string;
    available: boolean;
    plans?: initialPlanData[];
    stairs?: Array<string[]>;
};
type initialPlanData = {
    rooms: initialRoomData[];
    id: string;
    floor: string;
    available: boolean;
    wayToSvg: string;
    graph?: RawVertex[];
    entrances: Array<[string, string]>;
};
export type initialRoomData = {
    id: string;
    type: string;
    available: boolean;
    numberOrTitle: string;
    tabletText: string;
    addInfo: string;
};
export type RawVertex = {
    id: string;
    x: number;
    y: number;
    type: string;
    neighborData: Array<[string, number]>;
};

