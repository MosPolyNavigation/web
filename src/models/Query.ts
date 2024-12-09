import {appStore} from "../store/useAppStore";

export class Query {
    from: string | null //Айди аудитории отсюда

    to: string | null

    constructor({from, to }: { from: string; to: string }) {
        this.from = null
        this.to = null
        if(from) {
            this.from = from
        }
        if(to) {
            this.to = to
        }
        //Если нет текущего маршрута или у текущего маршрута не совпадают куда откуда с query-вскими
        if(this.to && this.from) {
            //то построить маршрут , а дальше посмотрим
        }
    }

    swap() {
        //Сделать состояния (это нужно чтобы сработала реактивность)
        // appStore().setQueryService(new Query({from: this.to, to: this.from}))
    }
}