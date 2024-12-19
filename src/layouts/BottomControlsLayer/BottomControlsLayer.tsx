import {FC} from 'react';
import {BtnName, Color, Layout, Pos} from '../../associations/enums.ts';
import {IconLink} from '../../associations/IconLink.ts';
import classNames from 'classnames';
import cl from './BottomControlsLayer.module.scss';
import Button from '../../components/buttons/LargeButton/Button.tsx';
import SearchButton from '../../components/buttons/SearchButton/SearchButton.tsx';
import {appStore, useAppStore} from '../../store/useAppStore.ts';
import {Pointer, QueryService} from "../../models/QueryService.ts";

const BottomControlsLayer: FC = () => {

	const [activeLayout,controlBtnClickHandler] = [useAppStore(state => state.activeLayout), useAppStore(state => state.controlBtnClickHandler)]
	const [selectedRoomId, changeSelectedRoom] = [useAppStore(state => state.selectedRoomId), useAppStore(state => state.changeSelectedRoom)]
	const queryService = useAppStore(state => state.queryService);
	const query = useAppStore(state => state.queryService);

	const heartBtnClickHandler = () => {
		if(!selectedRoomId) {
			changeSelectedRoom('n-405')
		}
		else {
			changeSelectedRoom(null)
		}
	};

	const rightBtnClass = classNames({
		[cl.locationsBtn]: (activeLayout !== Layout.SEARCH && activeLayout !== Layout.LOCATIONS),
	});

	const rightBtnIcon = (function() {
		if(activeLayout === Layout.SEARCH || activeLayout === Layout.LOCATIONS) return IconLink.CROSS;
		return IconLink.LOCATIONS;
	})();

	return (
		<div
			className={classNames(cl.bottomControlsLayer, {
				[cl.centered]: !!selectedRoomId && activeLayout !== Layout.SEARCH,
				[cl.searchOpen]: activeLayout === Layout.SEARCH,
			})}
		>
			{queryService.way ? <>
					<Button iconLink={IconLink.CROSS} onClick={() => appStore().setQueryService(new QueryService({from: Pointer.NOTHING, to: Pointer.NOTHING}))}/>
					<Button iconLink={IconLink.ARROW_RIGHT} text={'Далее: Корпус А'} textColor={Color.C4} textPosition={Pos.LEFT}/>
				</>
			: <>
					<Button
						classNameExt={cl.favouriteBtn}
						iconLink={IconLink.HEART}
						onClick={heartBtnClickHandler}
						//КНОПКА С СЕРДЕЧКОМ
					/>
					{activeLayout === Layout.PLAN &&
						<div style={{position: "absolute"}}>
							От: {query.from}
							<br />
							До: {query.to}
						</div>
					}
					<SearchButton
						expanded={activeLayout === Layout.SEARCH}
						onClick={() => controlBtnClickHandler(BtnName.SEARCH)}
					/>
					<Button
						iconLink={rightBtnIcon}
						classNameExt={rightBtnClass}
						onClick={() => controlBtnClickHandler(BtnName.BOTTOM_RIGHT)}
					/>
				</>}
		</div>
	);
};

export default BottomControlsLayer;
