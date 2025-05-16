import {FC, useMemo} from 'react';
import cl from './SpaceInfo.module.scss';
import Icon from '../../../common/Icon/Icon.tsx';
import {IconLink} from '../../../../constants/IconLink.ts';
import {Color, Size} from '../../../../constants/enums.ts';
import Button from '../../../buttons/LargeButton/Button.tsx';
import {appStore, useAppStore} from '../../../../store/useAppStore.ts';
import {QueryService} from "../../../../models/QueryService.ts";
import {useDataStore} from "../../../../store/useDataStore.ts";
import { useUserStore } from '../../../../models/data/getUserStoreId.ts';

const SpaceInfo: FC = () => {
	const selectedRoomId = useAppStore(state => state.selectedRoomId);
	const rooms = useDataStore(state => state.rooms);
	const room = useMemo(() => rooms.find(room => room.id === selectedRoomId), [selectedRoomId, rooms]);
	const { userId } = useUserStore();
	

	function fromBtnHandler() {
		appStore().setQueryService(new QueryService({from: selectedRoomId, userId: userId}))
		appStore().changeSelectedRoom(null)
	}

	function toBtnHandler() {
		appStore().setQueryService(new QueryService({to: selectedRoomId, userId: userId}))
		appStore().changeSelectedRoom(null)
	}


	if(!selectedRoomId)
		return null

	return (
		<div className={cl.spaceInfo}>
			<div className={cl.title}>
				{room.icon && <Icon color={Color.INITIAL} classNameExt={cl.spaceIcon} iconLink={room.icon}/>}
				<span>{room.title}</span>
			</div>

			<div className={cl.location}>{room.subTitle == '' ? <span>&nbsp;</span> : room.subTitle}</div>

			<div className={cl.actions}>
				<Button classNameExt={cl.heartBtn} color={Color.C4} size={Size.S} iconLink={IconLink.HEART}/>
				<Button color={Color.BLUE} size={Size.S} iconLink={IconLink.FROM} text="Отсюда" onClick={fromBtnHandler}/>
				<Button color={Color.BLUE} size={Size.S} iconLink={IconLink.TO} text="Сюда" onClick={toBtnHandler}/>
			</div>
		</div>
	);
};

export default SpaceInfo;
