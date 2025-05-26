//Граф тут из данных
import { dataStore } from '../store/useDataStore'
import { LocationData, PlanData } from '../constants/types'
import chalk from 'chalk'

export class Graph {
  vertexes: Array<Vertex> = [] //Мапа вершин
  readonly location: LocationData

  constructor(location: LocationData) {
    //Вызывается после того заполнились данные приложения и заполняет себя
    // @ts-expect-error 2339
    window.graph = this
    console.log('Граф начинает заполняться')
    this.location = location
    this.fillVertexesByRawVertexes()
    this.addStairs()
    this.addCrossings()
    console.log('Граф заполнен:', this)
  }

  private fillVertexesByRawVertexes() {
    const plansOfLocation = dataStore().plans.filter((plan) => plan.corpus.location === this.location)
    plansOfLocation.forEach((plan) => {
      plan.graph.forEach((rawVertex) => {
        this.vertexes.push(
          new Vertex(rawVertex.id, rawVertex.x, rawVertex.y, rawVertex.type, rawVertex.neighborData, plan)
        )
      })
    })
  }

  private addStairs() {
    //добавление связей между лестницами в графе по данным
    const corpusesOfLocations = dataStore().corpuses.filter((corpus) => corpus.location === this.location)
    // console.log(corpusesOfLocations)
    corpusesOfLocations.forEach((corpus) => {
      corpus.stairs.forEach((stairsGroup) => {
        for (let stairIndex = 1; stairIndex < stairsGroup.length; stairIndex++) {
          const lowerStairId = stairsGroup[stairIndex - 1]
          const upperStairId = stairsGroup[stairIndex]
          const lowerStairVertex = this.findVertexById(lowerStairId)
          const upperStairVertex = this.findVertexById(upperStairId)
          if (!lowerStairVertex) console.error(`Не удалось найти вершину лестницы ${chalk.underline(lowerStairId)}`)
          if (!upperStairVertex) console.error(`Не удалось найти вершину лестницы ${chalk.underline(upperStairId)}`)
          if (lowerStairVertex && upperStairVertex) this.addNeighborBoth(lowerStairVertex, upperStairVertex, 1085, 916)
        }
      })
    })
  }

  private addCrossings() {
    this.location.crossings.forEach((crossingGroup) => {
      const [crossing1Id, crossing2Id, distance] = crossingGroup
      const v1 = this.findVertexById(crossing1Id)
      const v2 = this.findVertexById(crossing2Id)
      if (!v1) console.error(`Не удалось найти вершину ${chalk.underline(crossing1Id)} для добавления в переходы`)
      if (!v2) console.error(`Не удалось найти вершину ${chalk.underline(crossing2Id)} для добавления в переходы`)
      if (v1 && v2) this.addNeighborBoth(v1, v2, distance, distance)
    })
  }

  findVertexById(id: VertexId) {
    return this.vertexes.find((vertex) => vertex.id === id)
  }

  private addNeighborBoth(vertex1: Vertex, vertex2: Vertex, distance1to2: number, distance2to1: number) {
    vertex1.neighborData.push([vertex2.id, distance1to2])
    vertex2.neighborData.push([vertex1.id, distance2to1])
  }

  public getShortestWayFromTo(idVertex1: VertexId, idVertex2: VertexId) {
    const start = Date.now()

    function isVertexNeedCheck(vertex: Vertex) {
      return (
        vertex.type === 'hallway' ||
        vertex.type === 'lift' ||
        vertex.type === 'stair' ||
        vertex.type === 'corpusTransition' ||
        vertex.type === 'crossingSpace' ||
        vertex.id === idVertex1 ||
        vertex.id === idVertex2 ||
        vertex.id.includes('crossing')
      )
    }

    /** Список проверяемых вершин (начальная и конечная, в коридорах, переходы лестницы и лифты) */
    const filteredVertexes = this.vertexes.filter((vertex) => isVertexNeedCheck(vertex))
    /** расстояния до вершин от начальной вершины (старта) */
    const distances = new Map()
    /** Маршруты - список точки от начальной */
    const ways: Map<VertexId, VertexId[]> = new Map()
    // для всех вершин устанавливаем бесконечную длину пути и пустые пути
    for (const vertex of filteredVertexes) {
      distances.set(vertex.id, Infinity)
      ways.set(vertex.id, [])
    }
    distances.set(idVertex1, 0) //для начальной вершины длина пути = 0
    /**  Вершины с окончательной длиной и путем (обработанные вершины) */
    const finals = new Set()

    /** ID обрабатываемой вершина */
    let currentVertexID = idVertex1
    // for (let i = 0; i < 2; i ++) {
    const iterations = [0, 0] //счётчик количества итераций внешнего и внутреннего циклов
    let isEndVertexInFinals = false //Флаг находится ли конечная вершина в обработанных

    // пока не посетили все вершины (или пока не обнаружено, что граф не связный) или пока не обработана конечная вершина
    while (finals.size !== filteredVertexes.length && !isEndVertexInFinals) {
      iterations[0] += 1

      const currentVertex = this.findVertexById(currentVertexID)

      if (!currentVertex) {
        console.error(`Попытка обработать вершину ${chalk.underline(currentVertexID)}, но ее не существует в графе`)
      }
      //релаксации для соседних вершин
      const currentVertexDistance = distances.get(currentVertexID) //длина до обрабатываемой вершины
      if (currentVertex) {
        for (const [neighborVertexId, distanceToNeighbor] of currentVertex.neighborData) {
          //для всех айдишников соседей вершины по айди
          const neighborVertex = this.findVertexById(neighborVertexId)
          if (!neighborVertex) {
            console.error(
              `У вершины ${currentVertexID} в соседях есть вершина ${neighborVertexId}, но ее не существует в графе`
            )
            continue
          }
          if (!filteredVertexes.includes(neighborVertex)) continue
          iterations[1] += 1
          const distanceBetweenCurrentAndNeighbor = distanceToNeighbor
          //расстояние между обрабатываемой и соседней вершиной
          const neighborDistance = distances.get(neighborVertexId) //расстояние до соседней вершины от старта

          //если расстояние до обр верш + между соседней < расст до соседней вершины от старта
          if (currentVertexDistance + distanceBetweenCurrentAndNeighbor < neighborDistance) {
            //обновляем расстояние до соседней вершины
            distances.set(neighborVertexId, currentVertexDistance + distanceBetweenCurrentAndNeighbor)
            //и путь для неё, как путь до текущей вершины + текущая вершина
            const wayToRelaxingVertex = Array.from(ways.get(currentVertexID) ?? [])
            wayToRelaxingVertex.push(currentVertexID)
            ways.set(neighborVertexId, wayToRelaxingVertex)
          }
        }
      }

      finals.add(currentVertexID) //помечаем текущую вершину как обработканную
      if (currentVertexID === idVertex2) isEndVertexInFinals = true
      //поиск следующей обрабатываемой вершины (необработанная вершина с наименьшим расстоянием от начала)
      let minDistance = Infinity
      let nextVertexID = ''
      for (const [id, distance] of distances) {
        if (distance < minDistance && !finals.has(id)) {
          minDistance = distance
          nextVertexID = id
          // console.log(minDistance, nextVertexID)
        }
      }
      if (minDistance === Infinity)
        //если граф несвязный то закончить поиск путей
        break
      currentVertexID = nextVertexID
    }
    for (const [id, way] of ways) {
      way.push(id)
    }
    console.log(
      `Путь найден за ${Date.now() - start} миллисекунд с количеством итераций ${iterations[0]}, ${iterations[1]} и количеством вершин ${filteredVertexes.length}`
    )
    return {
      way: ways.get(idVertex2)?.map((vertexId) => this.findVertexById(vertexId)),
      distance: Math.floor(distances.get(idVertex2)),
    }
  }

  getDistanceBetween2Vertexes(vertex1: Vertex, vertex2Id: VertexId) {
    const neighborRecord = vertex1.neighborData.find((record) => record[0] === vertex2Id)
    if (!neighborRecord)
      console.error(`Попытка получить расстояние ${vertex1.id} до соседа ${vertex2Id}, но они не соседи`)
    else return neighborRecord[1]
  }
}

type VertexId = string

export class Vertex {
  constructor(
    public id: VertexId,
    public x: number,
    public y: number,
    public type: string | 'hallway' | 'entrancesToAu' | 'stair' | 'crossing' | 'crossingSpace' | 'lift',
    public neighborData: Array<[string, number]>,
    public plan: PlanData
  ) {}
}
