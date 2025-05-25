import {PlanData} from "../constants/types";
import {dataStore} from "../store/useDataStore";
import {Vertex} from "./Graph";

export class Way {
	steps: Step[] = []; //Это вернуть
	to: string; //Вот тут будет не строка а RoomData
	from: string; //и тут тоже
	activeStep: number = 0
	fullDistance: number = 0

	constructor(from: string, to: string) {
		this.to = to;
		this.from = from;
		this.buildWayAndGetSteps(); //Массив со степсами
	}

	buildWayAndGetSteps() {
		const graph = dataStore().graph;
		if (graph) {
			const wayAndDistance = graph.getShortestWayFromTo(this.from, this.to)
			this.fullDistance = wayAndDistance.distance
			// console.log(wayAndDistance)
			if(!wayAndDistance.way) return
			if(!wayAndDistance.way.every(v => v instanceof Vertex)) return
			
			const way = [...wayAndDistance.way];
			const firstVertex = way.shift() as Vertex;
			this.steps = [new Step(firstVertex.plan, firstVertex)];
			for (const wayVertex of way) {
				const lastStep = this.steps.at(-1) as Step;
				if (wayVertex.plan === lastStep.plan) {
					lastStep.distance += graph.getDistanceBetween2Vertexes(
						lastStep.way.at(-1) as Vertex,
						wayVertex.id
					) ?? 0;
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
				const nearestNeighborV = graph.findVertexById(firstStep.way[0].neighborData[0][0])
				if(nearestNeighborV)
					firstStep.way.unshift( nearestNeighborV );
				firstStep.distance = firstStep.way[0].neighborData[0][1];
			}
			const lastStep = this.steps.at(-1)
			if (lastStep && lastStep.way.length === 1) {
				const nearestNeighborV = graph.findVertexById(lastStep.way[0].neighborData[0][0])
				if(nearestNeighborV)
					lastStep.way.push( nearestNeighborV);
				lastStep.distance = lastStep.way[0].neighborData[0][1];
			}
			//удаляем пустые этажи (обычно лестничный пролет)
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
