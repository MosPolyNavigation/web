import {FC} from 'react';
import cl from './SpaceInfo.module.scss';
import Icon from '../../../common/Icon/Icon.tsx';
import {IconLink} from '../../../../constants/IconLink.ts';
import {Color, Size} from '../../../../constants/enums.ts';
import Button from '../../../buttons/LargeButton/Button.tsx';
import {appStore, useAppStore} from '../../../../store/useAppStore.ts';
import {QueryService} from "../../../../models/QueryService.ts";

const SpaceInfo: FC = () => {
	const selectedRoomId = useAppStore(state => state.selectedRoomId);

	function fromBtnHandler() {
		appStore().setQueryService(new QueryService({from: selectedRoomId}))
		appStore().changeSelectedRoom(null)
	}

	function toBtnHandler() {
		appStore().setQueryService(new QueryService({to: selectedRoomId}))
		appStore().changeSelectedRoom(null)
	}



	return (
		<div className={cl.spaceInfo}>
			<div className={cl.title}>
				<Icon color={Color.VIOLET} classNameExt={cl.spaceIcon} iconLink={IconLink.STUDY}/>
				<span>Н405 - Аудитория</span>
			</div>

			{/*TODO: Это на время айдишник*/}
			<div className={cl.location}>Корпус Н, 4-й этаж, &nbsp;&nbsp; <u>id: {selectedRoomId}</u></div>

			<div className={cl.actions}>
				<Button classNameExt={cl.heartBtn} color={Color.C4} size={Size.S} iconLink={IconLink.HEART}/>
				<Button color={Color.BLUE} size={Size.S} iconLink={IconLink.FROM} text="Отсюда" onClick={fromBtnHandler}/>
				<Button color={Color.BLUE} size={Size.S} iconLink={IconLink.TO} text="Сюда" onClick={toBtnHandler}/>
			</div>
		</div>
	);
};

export default SpaceInfo;
