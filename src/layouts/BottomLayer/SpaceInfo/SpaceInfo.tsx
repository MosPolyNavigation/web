import {FC} from 'react';
import cl from './SpaceInfo.module.scss';
import Icon from '../../../components/common/Icon/Icon.tsx';
import {IconLink} from '../../../associations/IconLink.ts';
import {Color, Size} from '../../../associations/enums.ts';
import Button from '../../../components/buttons/LargeButton/Button.tsx';
import {useAppStore} from '../../../store/useAppStore.ts';

const SpaceInfo: FC = () => {
	const selectedRoom = useAppStore(state => state.selectedRoomId);
	
	return (
		<div className={cl.spaceInfo}>
			<div className={cl.title}>
				<Icon color={Color.VIOLET} classNameExt={cl.spaceIcon} iconLink={IconLink.STUDY} />
				<span>Н405 - Аудитория</span>
				
				{/*TODO: Это на время айдишник*/}
				{/*<span style={{color: Color.C4, fontWeight: 600, marginLeft: 150}}>{selectedRoom}</span>*/}
				
			</div>

			<div className={cl.location}>Корпус Н, 4-й этаж, &nbsp;&nbsp; <u>id: {selectedRoom}</u></div>

			<div className={cl.actions}>
				<Button classNameExt={cl.heartBtn} color={Color.C4} size={Size.S} iconLink={IconLink.HEART} />
				<Button color={Color.BLUE} size={Size.S} iconLink={IconLink.FROM} text="Отсюда" />
				<Button color={Color.BLUE} size={Size.S} iconLink={IconLink.TO} text="Сюда" />

			</div>

		</div>
	);
};

export default SpaceInfo;
