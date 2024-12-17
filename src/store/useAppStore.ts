import {create} from 'zustand/react';
import {BtnName, Layout} from '../associations/enums.ts';

import {PlanData, RoomModel} from '../associations/types.ts';
import {PlanModel} from '../models/Plan/PlanModel.ts';
import {QueryService} from "../models/QueryService";
import chalk from "chalk";

type State = {
	activeLayout: Layout
	previousLayout: Layout
	selectedRoomId: null | string
	currentPlan: null | PlanData
	previousPlan: PlanData | null
	planModel: null | PlanModel
	query: QueryService
}

type Action = {
	changeSelectedRoom: (roomId: null | string) => void;
	controlBtnClickHandler: (btnName: BtnName) => void
	changeLayout: (layout: Layout) => void
	changeCurrentPlan: (plan: PlanData | null) => void
	changePlanModel: (
		planInf: PlanData,
		planSvgEl: SVGSVGElement,
		virtualSvg: SVGSVGElement | HTMLElement,
		roomClickHandler: (room: RoomModel) => void,
	) => void,
	setQuery: (query: QueryService) => void
}

export function appStore() {
	return useAppStore.getState()
}

export const useAppStore = create<State & Action>()((set, get) => ({
	activeLayout: Layout.PLAN,
	previousLayout: Layout.PLAN,
	currentPlan: null,
	previousPlan: null,
	selectedRoomId: null,
	planModel: null,
	updateState: {},
	query: new QueryService(),


	controlBtnClickHandler: (btnName) => {
		const activeLayout = get().activeLayout;
		if (btnName === BtnName.MENU && activeLayout === Layout.PLAN) {
			get().changeLayout(Layout.MENU);
		} //Показать левое меню

		else if (btnName === BtnName.MENU_CLOSE && activeLayout === Layout.MENU) {
			get().changeLayout(Layout.PLAN);
		} //Скрыть левое меню

		else if (btnName === BtnName.BOTTOM_RIGHT) {
			if (activeLayout === Layout.PLAN) {
				get().changeSelectedRoom(null)
				get().changeLayout(Layout.LOCATIONS);
			} else if (activeLayout === Layout.LOCATIONS)
				get().changeLayout(Layout.PLAN);
			else if (activeLayout === Layout.SEARCH)
				get().changeLayout(get().previousLayout);
		} //Показать левое меню

		else if (btnName === BtnName.SEARCH && activeLayout !== Layout.SEARCH) {
			get().changeLayout(Layout.SEARCH);
		} //Скрыть левое меню
	},

	/**
	 * Выбрать (выделить) помещение, влияет на подсветку помещения и состояние приложения `selectedRoomId`, а также на отображение нижней карточки с инфо о помещении
	 * @param roomId id помещения которое надо выбрать или `null` чтобы снять выделение
	 */
	changeSelectedRoom: (roomId) => {
		if (get().selectedRoomId !== roomId) {
			set(({selectedRoomId: roomId}));
			const planModel = get().planModel;
			if (planModel) {
				planModel.toggleRoom(null, {hideRooms: true, hideEntrances: true});
				if (roomId) {
					const room = planModel.rooms.get(roomId);
					if (room) {
						planModel.toggleRoom(room, {activateRoom: true, activateEntrance: true})
					}
				}
			}
		}

		// if (get().selectedRoomId) console.log(`Выбрано помещение ${chalk.underline(get().selectedRoomId)}`)
		// else console.log(`Снят выбор помещения`)
	},

	changeCurrentPlan: (plan) => {
		if (get().currentPlan !== plan && plan) {
			set(({previousPlan: get().currentPlan}));
			set(({currentPlan: plan}));
			console.log(`План изменен на ${chalk.underline(plan.id)}`,);
			console.log();
		}
	},

	changeLayout: (layout) => {
		if (layout !== get().activeLayout) {
			// console.log(`Слой изменён на: %c${layout}}`, 'font-weight: bold;');
			set({previousLayout: get().activeLayout});
			set({activeLayout: layout});
		}
	},

	changePlanModel: (planInf, planSvgEl, virtualSvg, roomClickHandler) => {
		set({planModel: new PlanModel(planInf, planSvgEl, virtualSvg, roomClickHandler)});
	},

	setQuery: (query) => {
		set({query: query});
	}
}));
