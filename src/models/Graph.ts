//Граф тут из данных
import {useDataStore} from "../store/useDataStore";
import {LocationData} from "../associations/types";

export class Graph {
    vertexes: Map<VertexId, Vertex> //Мапа вершин



    constructor(location: LocationData) { //Вызывается после того заполнились данные приложения и заполняет себя
        console.log( useDataStore.getState().locations ) //Вывести в консоль локации
        console.log(location)
        console.log('Граф начинает заполняться')
        this.vertexes = new Map()
    }
}

type VertexId = string

class Vertex {}