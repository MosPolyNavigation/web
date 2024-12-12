//Граф тут из данных
import {dataStore, useDataStore} from "../store/useDataStore";
import {LocationData, PlanData} from "../associations/types";
import { Way } from "./Way";

export class Graph {
    vertexes: Array<Vertex> = [] //Мапа вершин
    readonly location: LocationData


    constructor(location: LocationData) { //Вызывается после того заполнились данные приложения и заполняет себя 
        console.log('Граф начинает заполняться')
        this.location = location
        this.fillVertexesByRawVertexes()
        this.addStairs()
        this.addCrossings()
        console.log(this.vertexes.filter(vertex => vertex.type === 'crossing'))
        const types = new Set(
            this.vertexes.map(vertex => vertex.type)
        )      
		
    }


    private fillVertexesByRawVertexes(){
        const plansOfLocation = dataStore().plans.filter(plan => plan.corpus.location === this.location)
        plansOfLocation.forEach(plan => {
            plan.graph.forEach(rawVertex => {
                this.vertexes.push(new Vertex(
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
    }


    private addStairs() { //добавление связей между лестницами в графе по данным
        const corpusesOfLocations = dataStore().corpuses.filter(corpus => corpus.location === this.location)
        console.log(corpusesOfLocations)
        corpusesOfLocations.forEach(corpus => {
            corpus.stairs.forEach(stairsGroup => {
                for (let stairIndex = 1; stairIndex < stairsGroup.length; stairIndex ++) {
                    const stair1Vertex = this.findVertexById(stairsGroup[stairIndex-1])
                    const stair2Vertex = this.findVertexById(stairsGroup[stairIndex])
                    this.addNeighborBoth(stair1Vertex, stair2Vertex, 1085, 916)
                }
            })
        })
	}

    private addCrossings() {
        this.location.crossings.forEach( crossingGroup => {
            const [crossing1Id, crossing2Id, distance] = crossingGroup
            this.addNeighborBoth(
                this.findVertexById(crossing1Id),
                this.findVertexById(crossing2Id),
                distance,
                distance
            )
        })
    } 

    
    findVertexById (id: string): Vertex {
        return this.vertexes.find(vertex => vertex.id === id) as Vertex
    }

    private addNeighborBoth(vertex1: Vertex, vertex2: Vertex, distance1to2: number, distance2to1: number) {
		vertex1.neighborData.push([vertex2.id, distance1to2])
        vertex2.neighborData.push([vertex1.id, distance2to1])
	}

    public getShortestWayFromTo(idVertex1, idVertex2): {way: Vertex[], distance: number} {
		let start = Date.now()

		function isVertexNeedCheck(vertex) {
			return (vertex.type === 'hallway' ||
				vertex.type === 'lift' ||
				vertex.type === 'stair' ||
				vertex.type === 'corpusTransition' ||
				vertex.type === 'crossingSpace' ||
				vertex.id === idVertex1 ||
				vertex.id === idVertex2 ||
				vertex.id.includes('crossing')
			)
		}

		let filteredVertexes = this.vertexes.filter((vertex) => isVertexNeedCheck(vertex))
		//Список вершин находящиеся только в коридорах
		let distances = new Map() //расстояния до вершин от начальной точки (старта)
		let ways = new Map() //маршруты из точек
		for (let vertex of filteredVertexes) { // для всех вершин устанавливаем бесконечную длину пути
			distances.set(vertex.id, Infinity)
			ways.set(vertex.id, [])
		}
		distances.set(idVertex1, 0) //для начальной вершины длина пути = 0
		let finals = new Set() //вершины с окончательной длиной (обработанные вершины)

		let currentVertexID = idVertex1 //ид обрабатываемой вершины
		// for (let i = 0; i < 2; i ++) {
		let iterations = [0, 0] //счётчик количества итераций внешнего и внутреннего циклов
		let isEndVertexInFinals = false //Флаг находится ли конечная вершина в обработанных
		while (finals.size !== filteredVertexes.length && !isEndVertexInFinals) { //пока не посетили все вершины (или пока не обнаружено, что
			// граф не связный) или пока не обработана конечная вершина
			iterations[0] += 1

			//релаксации для соседних вершин
			let currentVertexDistance = distances.get(currentVertexID) //длина до обрабатываемой вершины
			for (let [neighborId, distanceToNeighbor] of this.findVertexById(currentVertexID).neighborData) { //для всех айдишников соседей вершины по айди
				if (!filteredVertexes.includes(this.findVertexById(neighborId)))
					continue
				iterations[1] += 1
				let distanceBetweenCurrentAndNeighbor = distanceToNeighbor
				//расстояние между обрабатываемой и соседней вершиной
				let neighborDistance = distances.get(neighborId) //расстояние до соседней вершины от старта

				//если расстояние до обр верш + между соседней < расст до соседней вершины от старта
				if (currentVertexDistance + distanceBetweenCurrentAndNeighbor < neighborDistance) {
					//обновляем расстояние до соседней вершины
					distances.set(neighborId, currentVertexDistance + distanceBetweenCurrentAndNeighbor)
					//и путь для нёё, как путь до текущей вершины + текущая вершина
					let wayToRelaxingVertex = Array.from(ways.get(currentVertexID))
					wayToRelaxingVertex.push(currentVertexID)
					ways.set(neighborId, wayToRelaxingVertex)
				}

			}

			finals.add(currentVertexID) //помечаем текущую вершину как обработканную
			if (currentVertexID === idVertex2)
				isEndVertexInFinals = true
			//поиск следующей обрабатываемой вершины (необработанная вершина с наименьшим расстоянием от начала)
			let minDistance = Infinity
			let nextVertexID = ''
			for (let [id, distance] of distances) {
				if (distance < minDistance && (!finals.has(id))) {
					minDistance = distance
					nextVertexID = id
					// console.log(minDistance, nextVertexID)
				}
			}
			if (minDistance === Infinity) //если граф несвязный то закончить поиск путей
				break
			currentVertexID = nextVertexID
		}
		for (let [id, way] of ways) {
			way.push(id)
		}
		// console.log(distances)
		console.log((idVertex2))
		console.log(`Путь найден за ${Date.now() - start} миллисекунд с количеством итераций ${iterations[0]}, ${iterations[1]} и количеством вершин ${filteredVertexes.length}`)
		return {
			way: ways.get(idVertex2).map(vertexId => this.findVertexById(vertexId)),
			distance: Math.floor(distances.get(idVertex2))
		}
	}

	getDistanceBetween2Vertexes(vertex1: Vertex, vertex2Id: string): number{
		return vertex1.neighborData.find(note => note[0]===vertex2Id)[1]
	}
}

type VertexId = string

export class Vertex {
    id: string
    x: number
    y: number
    type: string | 'hallway' | 'entrancesToAu' | 'stair' | 'crossing' | 'crossingSpace' | 'lift'
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