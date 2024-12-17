import {FC, useEffect, useMemo, useRef, useState} from 'react';
import cl from './PlanLayout.module.scss';
import {appStore, useAppStore} from '../../store/useAppStore.ts';
import {appConfig} from '../../appConfig.ts';
import axios from 'axios';
import {getSvgLink} from '../../functions/planFunctions.ts';
import {RoomModel} from '../../associations/types.ts';
import {Vertex} from "../../models/Graph.ts";
import classNames from "classnames";

const PlanLayout: FC = () => {
	const planSvgRef = useRef<null | SVGSVGElement>(null);
	const currentPlan = useAppStore(state => state.currentPlan);
	const planModel = useAppStore(state => state.planModel)
	const query = useAppStore(state => state.query);

	const svgLink = useMemo<string | null>(() => {
		if (currentPlan) {
			return appConfig.svgSource + currentPlan?.wayToSvg;
		}
		return null;
	}, [currentPlan]);

	function roomClickHandler(room: RoomModel) {
		if (appStore().selectedRoomId !== room.roomId) {
			appStore().changeSelectedRoom(room.roomId)
		} else {
			appStore().changeSelectedRoom(null)
		}
	}

	useEffect(() => {
		if (currentPlan) {
			axios.get(getSvgLink(currentPlan))
				.then(response => {
					if (!planSvgRef.current) return; //Если вдруг нет свгшки на странице, пропустить
					// Парсинг полученного текста свг=изображения в виртуальный ДОМ-элемент
					const parsedSvgDomEl = (new DOMParser()).parseFromString(response.data, 'image/svg+xml').documentElement as SVGSVGElement | HTMLElement;
					appStore().changePlanModel(currentPlan, planSvgRef.current, parsedSvgDomEl, roomClickHandler) //Установка новой модели-плана в стор приложения
				});
		}
	}, [currentPlan]);

	const viewBox = useMemo(() => {
		if (planModel) return planModel.planSvgEl.getAttribute('viewBox')
		else return '0 0 0 0'
	}, [planModel])

	const endArrowAnimationEl = useRef<null | SVGAnimateElement>(null)

	const [wayAnimationClass, setWayAnimationClass] = useState(cl.wayAnimation)
	const {primaryWayPathD, primaryWayLength} = useMemo(() => {
		let queryService = appStore().query.way;
		if (queryService) {
			const currentStep = queryService.steps[queryService.activeStep]
			if (currentStep.plan === currentPlan) {
				const vertexesOfWay = currentStep.way
				setWayAnimationClass('')
				setTimeout(() => {
					if (endArrowAnimationEl.current) endArrowAnimationEl.current.beginElement()
				}, 850)
				return {
					primaryWayPathD: generatePathD(vertexesOfWay),
					primaryWayLength: currentStep.distance
				}
			}
		}
		return {
			primaryWayPathD: '',
			primaryWayLength: null
		}
	}, [planModel, query])

	useEffect(() => {
		if (wayAnimationClass === '') {
			setWayAnimationClass(cl.wayAnimation)
		}
	}, [wayAnimationClass]);


	return (
		<div className={cl.planWrapper}>
			{svgLink && <div className={cl.planWrapperInner}>
				<svg className={cl.planSvg} ref={planSvgRef}></svg>
				<svg className={cl.planAddingObjects} viewBox={viewBox}>
					{primaryWayPathD &&
						<path d={primaryWayPathD} className={classNames(cl.way, wayAnimationClass)}
						      style={{strokeDasharray: primaryWayLength, strokeDashoffset: primaryWayLength}}
						      markerStart="url(#way-start-circle)" markerEnd="url(#way-end-arrow)"
						/>
					}
					<defs>
						<marker id="way-end-arrow" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="22"
						        refX="15" refY="11" viewBox="0 0 20 22" fill="none" orient="auto-start-reverse"
						>
							{/*<path key={primaryWayPathD} className={classNames(cl.endArrow, wayAnimationClass)}>*/}
							<path key={primaryWayPathD} className={classNames(cl.endArrow, wayAnimationClass)}>
							</path>
						</marker>
						<marker id="way-start-circle" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20"
						        refX="10" refY="10" viewBox="0 0 20 20" fill="none"
						>
							<circle fill="white" cx="10" cy="10" className={classNames(cl.startCircle, wayAnimationClass)}/>
						</marker>
					</defs>
				</svg>
			</div>}
		</div>
	);
};

export default PlanLayout;

function generatePathD(points: Point[]) {
	if (!points || points.length === 0) {
		return '';
	}

	let d = `M ${points[0].x} ${points[0].y}`;

	for (let i = 1; i < points.length; i++) {
		d += ` L ${points[i].x} ${points[i].y}`;
	}

	return d;
}

type Point = {
	x: number,
	y: number
}