//Граф тут из данных
import {dataStore, useDataStore} from "../store/useDataStore";
import {LocationData} from "../associations/types";

export class Graph {
    vertexes: Map<VertexId, Vertex> //Мапа вершин



    constructor(location: LocationData) { //Вызывается после того заполнились данные приложения и заполняет себя
        console.log(location)
        const corpusesOfLocation = dataStore().corpuses.filter(corpus => corpus.location === location)
        console.log(corpusesOfLocation)
        corpusesOfLocation.forEach(corpus => {
            const plansOfCorpus = dataStore().plans.filter(plan => plan.corpus === corpus);
            console.log(plansOfCorpus)
        })
        console.log('Граф начинает заполняться')
        this.vertexes = new Map()
    }
}

type VertexId = string

class Vertex {}