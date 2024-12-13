import { PlanData } from "../associations/types";
import { dataStore, useDataStore } from "../store/useDataStore";
import { Vertex } from "./Graph";

export class Way {
	steps: Step[]; //Это вернуть
	to: string; //Вот тут будет не строка а RoomData
	from: string; //и тут тоже
	activeStep: number;
	fullDistance: number;

	constructor(from: string, to: string) {
		this.to = to;
		this.from = from;
		this.buildWayAndGetSteps(); //Массив со степсами
	}

	buildWayAndGetSteps() {
		const graph = dataStore().graph;
		if (graph) {
			const wayAndDistance = graph.getShortestWayFromTo(this.from, this.to)
			console.log(wayAndDistance)
			this.fullDistance = wayAndDistance.distance;
			let way = [...wayAndDistance.way];
			this.activeStep = 0;
			let firstVertex = way.shift() as Vertex;
			this.steps = [new Step(firstVertex.plan, firstVertex)];
			for (const wayVertex of way) {
				let lastStep = this.steps.at(-1) as Step;
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
				firstStep.way.unshift( graph.findVertexById(firstStep.way[0].neighborData[0][0]) );
				firstStep.distance = firstStep.way[0].neighborData[0][1];
			}
			const lastStep = this.steps.at(-1) 
			if (lastStep && lastStep.way.length === 1) {
				lastStep.way.push( graph.findVertexById(lastStep.way[0].neighborData[0][0] ));
				lastStep.distance = lastStep.way[0].neighborData[0][1];
			}
			//удаляем пустые этажи (обычно лестничный пролет)
			this.steps = this.steps.filter((step) => step.way.length > 1);

			console.log(this);
		}

		return [];
	}

	oldConstructor(wayAndDistance) { }
}

class Step {
	plan: PlanData;
	way: Vertex[];
	distance: number;

	constructor(plan, firstVertexId) {
		this.plan = plan;
		this.way = [firstVertexId];
		this.distance = 0;
	}
}
