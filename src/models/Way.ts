import {dataStore, useDataStore} from "../store/useDataStore";

export class Way {
    steps: [] //Это вернуть
    to: string //Вот тут будет не строка а RoomData
    from: string //и тут тоже

    constructor(from: string, to: string) {
        this.to = to;
        this.from = from

        this.steps = this.buildWayAndGetSteps() //Массив со степсами
    }

    buildWayAndGetSteps(): [] {
        const graph = dataStore().graph
        if(graph) {
            //вот тут вот код
        }

        return []
    }
}