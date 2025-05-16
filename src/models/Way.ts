import axios from "axios";
import {PlanData} from "../constants/types";
import {dataStore} from "../store/useDataStore";
import {Vertex} from "./Graph";

export class Way {
    steps: Step[]; // Это вернуть
    to: string; // Вот тут будет не строка а RoomData
    from: string; // и тут тоже
    activeStep: number = 0;
    fullDistance: number = 0;
    userId: string | null

    constructor(from: string, to: string, userId: string | null) {
        this.to = to;
        this.from = from;
        this.userId = userId
        this.buildWayAndGetSteps();
        this.sendStartWayStat();
    }

    async sendStartWayStat() {
        try {
            await axios.put('https://mpunav.ru/api/stat/start-way', {
                start_id: this.from,
                end_id: this.to,
                userId: this.userId || null
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            return error
        }
    }

    buildWayAndGetSteps() {
        const graph = dataStore().graph;
        if (graph) {
            const wayAndDistance = graph.getShortestWayFromTo(this.from, this.to)
            this.fullDistance = wayAndDistance.distance

            const way = [...wayAndDistance.way];
            const firstVertex = way.shift() as Vertex;
            this.steps = [new Step(firstVertex.plan, firstVertex)];
            for (const wayVertex of way) {
                const lastStep = this.steps.at(-1) as Step;
                if (wayVertex.plan === lastStep.plan) {
                    lastStep.distance += graph.getDistanceBetween2Vertexes(
                        lastStep.way.at(-1) as Vertex,
                        wayVertex.id
                    );
                    lastStep.way.push(wayVertex);
                } else {
                    this.steps.push(
                        new Step(
                            wayVertex.plan,
                            wayVertex
                        )
                    );
                }
            }
            const firstStep = this.steps[0]
            if (firstStep.way.length === 1) {
                firstStep.way.unshift(graph.findVertexById(firstStep.way[0].neighborData[0][0]));
                firstStep.distance = firstStep.way[0].neighborData[0][1];
            }
            const lastStep = this.steps.at(-1)
            if (lastStep && lastStep.way.length === 1) {
                lastStep.way.push(graph.findVertexById(lastStep.way[0].neighborData[0][0]));
                lastStep.distance = lastStep.way[0].neighborData[0][1];
            }
            // удаляем пустые этажи (обычно лестничный пролет)
            this.steps = this.steps.filter((step) => step.way.length > 1);
        }

        return [];
    }
}

export class Step {
	plan: PlanData
	way: Vertex[];
	distance: number;

	constructor(plan: PlanData, firstVertex: Vertex) {
		this.plan = plan
		this.way = [firstVertex];
		this.distance = 0;
	}
}
