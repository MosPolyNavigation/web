import React, {FC, useEffect, useState} from 'react';

import {Layout} from '../../../constants/enums.ts';

import classNames from 'classnames';
import cl from './BottomControlsLayer.module.scss';

import {useAppStore} from '../../../store/useAppStore.ts';

import BaseControls from "./BaseControls/BaseControls.tsx";
import OnWayControls from "./OnWayControls/OnWayControls.tsx";
import WaySelectorsControls from "./WaySelectorsControls/WaySelectorsControls.tsx";

const BottomControlsLayer: FC = () => {

	const activeLayout = useAppStore(state => state.activeLayout)
	const selectedRoomId = useAppStore(state => state.selectedRoomId)
	const queryService = useAppStore(state => state.queryService);

	return (
		<div
			className={classNames(cl.bottomControlsLayer, {
				[cl.centered]: (!!selectedRoomId || queryService.steps) && activeLayout !== Layout.SEARCH,
				[cl.searchOpen]: activeLayout === Layout.SEARCH,
				[cl.flexCenter]: (queryService.from || queryService.to) && !(queryService.from && queryService.to)
			})}
		>

			{((queryService.from || queryService.to) && !(queryService.from && queryService.to) && activeLayout !== Layout.SEARCH)
				? <WaySelectorsControls/>
				: (queryService.from && queryService.to && activeLayout !== Layout.SEARCH)
					? <OnWayControls/>
					: <BaseControls/>
			}
		</div>
	);
};

export default BottomControlsLayer;