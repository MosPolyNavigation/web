import React, {useMemo} from 'react';
import WaySelectorButton from "../../../buttons/WaySelectorButton/WaySelectorButton.tsx";
import Button from "../../../buttons/LargeButton/Button.tsx";
import {Pointer, QueryService} from "../../../../models/QueryService.ts";
import {IconLink} from "../../../../constants/IconLink.ts";
import Icon from "../../../common/Icon/Icon.tsx";
import {BtnName, Color, Layout, SearchIndent, Size} from "../../../../constants/enums.ts";
import {appStore, useAppStore} from "../../../../store/useAppStore.ts";
import cl from "./WaySelectorsControls.module.scss";
import classNames from "classnames";
import {useDataStore} from "../../../../store/useDataStore.ts";


function WaySelectorsControls() {
	const activeLayout = useAppStore(state => state.activeLayout)
	const rooms = useDataStore(state => state.rooms);
	const queryService = useAppStore(state => state.queryService);
	const roomFrom = useMemo(() => rooms.find(room => room.id === queryService.from), [queryService, rooms]);
	const roomTo = useMemo(() => rooms.find(room => room.id === queryService.to), [queryService, rooms]);

	const rightBtnClass = classNames({
		[cl.locationsBtn]: (activeLayout !== Layout.SEARCH && activeLayout !== Layout.LOCATIONS),
	});

	const rightBtnIcon = (function () {
		if (activeLayout === Layout.SEARCH || activeLayout === Layout.LOCATIONS) return IconLink.CROSS;
		return IconLink.LOCATIONS;
	})();

	return (
		<div className={cl.waySelectorsControlsWrapper}>
			<Button
				size={Size.M}
				iconLink={rightBtnIcon}
				classNameExt={rightBtnClass}
				onClick={() => appStore().controlBtnClickHandler(BtnName.BOTTOM_RIGHT)}
			/>
			<div className={cl.wayInfoContent}>
				<WaySelectorButton
					text={roomFrom ? roomFrom.title : null} baseText={"Откуда"} icon={roomFrom ? roomFrom.icon : null}
					baseIcon={IconLink.FROM}
					onClick={() => {
						appStore().controlBtnClickHandler(BtnName.SEARCH)
						appStore().setSearchIndent(SearchIndent.SET_FROM)
					}}
					onCrossClick={() => appStore().setQueryService(new QueryService({from: Pointer.NOTHING}))}
				/>
				<button className={cl.swapButton}
				        onClick={() => appStore().setQueryService(new QueryService({swap: true}))}>
					<Icon iconLink={IconLink.SWAP} color={Color.C3} size={Size.M}/>
				</button>

				<WaySelectorButton
					text={roomTo ? roomTo.title : null} baseText={"Куда"} icon={roomTo ? roomTo.icon : null}
					baseIcon={IconLink.FROM}
					onClick={() => {
						appStore().controlBtnClickHandler(BtnName.SEARCH)
						appStore().setSearchIndent(SearchIndent.SET_TO)
					}}
					onCrossClick={() => appStore().setQueryService(new QueryService({to: Pointer.NOTHING}))}
				/>
			</div>

		</div>

	);
}

export default WaySelectorsControls;