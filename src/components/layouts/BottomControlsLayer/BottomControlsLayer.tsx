import React, {FC, useEffect, useState} from 'react';

import {Layout} from '../../../constants/enums.ts';

import classNames from 'classnames';
import cl from './BottomControlsLayer.module.scss';

import {useAppStore} from '../../../store/useAppStore.ts';

import BaseControls from "./BaseControls/BaseControls.tsx";
import OnWayControls from "./OnWayControls/OnWayControls.tsx";
import WaySelectorsControls from "./WaySelectorsControls/WaySelectorsControls.tsx";

const BottomControlsLayer: FC = () => {

	const [activeLayout, controlBtnClickHandler] = [useAppStore(state => state.activeLayout), useAppStore(state => state.controlBtnClickHandler)]
	const [selectedRoomId, changeSelectedRoom] = [useAppStore(state => state.selectedRoomId), useAppStore(state => state.changeSelectedRoom)]
	const queryService = useAppStore(state => state.queryService);
	const query = useAppStore(state => state.queryService);

	const heartBtnClickHandler = () => {
		if (!selectedRoomId) {
			changeSelectedRoom('n-405')
		} else {
			changeSelectedRoom(null)
		}
	};

	return (
		<div
			className={classNames(cl.bottomControlsLayer, {
				[cl.centered]: (!!selectedRoomId || queryService.steps) && activeLayout !== Layout.SEARCH,
				[cl.searchOpen]: activeLayout === Layout.SEARCH,
				[cl.flexCenter]: (queryService.from || queryService.to) && !(queryService.from && queryService.to)
			})}
		>
			{/*Если выбоано только откуда или только куда то компонент WatSelectorsControl, если нет то проверяем либо выбрано откуда и куда вместе(отдаем компонент OnWayControls) либо вообще ничего не выбрано(BaseControls) */}
			{console.log(queryService.from, queryService.to, queryService.steps)}
			{(queryService.from || queryService.to) && !(queryService.from && queryService.to)
				?
				<WaySelectorsControls fromWay={queryService.from} toWay={queryService.to} />

				: (queryService.from && queryService.to) ? <OnWayControls />
						:  <BaseControls />
			}
		</div>
	);
};

export default BottomControlsLayer;