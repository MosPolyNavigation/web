//Граф тут из данных
import {dataStore, useDataStore} from "../store/useDataStore";
import {LocationData, PlanData} from "../associations/types";

export class Graph {
    vertexes: Array<Vertex> = [] //Мапа вершин



    constructor(location: LocationData) { //Вызывается после того заполнились данные приложения и заполняет себя 
        console.log('Граф начинает заполняться')

        const plansOfLocations = dataStore().plans.filter(plan => plan.corpus.location === location)
        let vertexes = this.fillVertexesByRawVertexes(plansOfLocations)
        
        this.vertexes = vertexes
        console.log(this.vertexes)      
    }


    private fillVertexesByRawVertexes(plans: Array<PlanData>){
        const vertexes: Vertex[] = []
        plans.forEach(plan => {
            plan.graph.forEach(rawVertex => {
                vertexes.push(new Vertex(
                    rawVertex.x,
                    rawVertex.y,
                    rawVertex.id,
                    rawVertex.type,
                    rawVertex.neighborData,
                    plan
                ))
                plan.graph = []
            }) 
        });
        return vertexes;
    }

    private addStairs(vertexes: Vertex[]) { //добавление связей между лестницами в графе по данным
		// console.groupCollapsed('Добавление лестниц')
		for (const [, campus] of campuses) {
			for (let corpusID in campus['corpuses']) {
				for (let stairsGroup of campus['corpuses'][corpusID]['stairsGroups']) {
					for (let stairIndex = 1; stairIndex < stairsGroup.length; stairIndex ++) {
						const stairId1 = stairsGroup[stairIndex-1];
						const stairId2 = stairsGroup[stairIndex];
						this.addNeighborBoth(stairId1, stairId2, 1085, 916)
					}
				}
			}
		}
		// console.groupEnd()
	}
}

type VertexId = string

class Vertex {
    id: string
    x: number
    y: number
    type: string
    neighborData: Array<[string, number]>
    plan: PlanData

	constructor(x, y, id, type, neighborData, plan) {
		this.id = id
		this.x = x
		this.y = y
		this.type = type
		this.neighborData = neighborData
		this.plan = plan
	}
}