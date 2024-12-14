import {FC, useEffect, useMemo, useRef} from 'react';
import cl from './PlanLayout.module.scss';
import {appStore, useAppStore} from '../../store/useAppStore.ts';
import {appConfig} from '../../appConfig.ts';
import axios from 'axios';
import {getSvgLink} from '../../functions/planFunctions.ts';
import {RoomModel} from '../../associations/types.ts';

const PlanLayout: FC = () => {
	const currentPlan = useAppStore(state => state.currentPlan);
	
	const svgLink = useMemo<string | null>(() => {
		if(currentPlan) {
			return appConfig.svgSource + currentPlan?.wayToSvg;
		}
		return null;
	}, [currentPlan]);

	const planSvgRef = useRef<null | SVGSVGElement>(null);
	
	function roomClickHandler(room: RoomModel) {
		const planModel = appStore().planModel
		if(planModel) {
			if(appStore().selectedRoomId !== room.roomId) {
				appStore().changeSelectedRoom(room.roomId)
			}
			else {
				appStore().changeSelectedRoom(null)
			}
		}
	}

	useEffect(() => {
		if(currentPlan) {
			axios.get(getSvgLink(currentPlan))
				.then(response => {
					if(!planSvgRef.current) return; //Если вдруг нет свгшки на странице, пропустить
					// Парсинг полученного текста свг=изображения в виртуальный ДОМ-элемент
					const parsedSvgDomEl = (new DOMParser()).parseFromString(response.data, 'image/svg+xml').documentElement as SVGSVGElement | HTMLElement;
					appStore().changePlanModel(currentPlan, planSvgRef.current, parsedSvgDomEl, roomClickHandler) //Установка новой модели-плана в стор приложения
				});
		}
	}, [currentPlan]);


	return (
		<div className={cl.planWrapper}>
			{svgLink &&
				<svg className={cl.planSvg} ref={planSvgRef}></svg>
			}
		</div>
	);
};

export default PlanLayout;
