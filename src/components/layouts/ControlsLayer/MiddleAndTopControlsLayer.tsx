import {FC} from 'react';
import cl from './ControlsLayer.module.scss';
import Button from '../../buttons/LargeButton/Button.tsx';
import FloorsControl from '../../controls/FloorsControl/FloorsControl.tsx';
import ScaleControl from '../../controls/ScaleControl/ScaleControl.tsx';
import {IconLink} from '../../../constants/IconLink.ts';
import {BtnName, Layout} from '../../../constants/enums.ts';
import classNames from 'classnames';
import {useAppStore} from '../../../store/useAppStore.ts';
import LoadMsg from './LoadMsg/LoadMsg.tsx';
import Shadow from './Shadow/Shadow.tsx';

const MiddleAndTopControlsLayer: FC = () => {

	const [activeLayout, controlBtnClickHandler] = [useAppStore(state => state.activeLayout), useAppStore(state => state.controlBtnClickHandler)];
	const previousLayout = useAppStore(state => state.previousLayout);
	const currentPlan = useAppStore(state => state.currentPlan);


	return (
		<div
			className={classNames(cl.middleAndTopControlsLayer, {
				[cl.hidden]: (activeLayout === Layout.LOCATIONS) || (activeLayout === Layout.SEARCH && previousLayout === Layout.LOCATIONS),
			})}
		>
			<Shadow />

			<div className={cl.top}>
				<Button
					iconLink={IconLink.MENU}
					onClick={() => controlBtnClickHandler(BtnName.MENU)}
				/>
				<div className={cl.planInfo}>{
					currentPlan
						? <>{currentPlan.corpus.location.short}, корпус {currentPlan.corpus.title}, этаж {currentPlan.floor}</>
						: <LoadMsg />
				}</div>
			</div>

			<div className={cl.middle}>
				<FloorsControl />
				<ScaleControl />
			</div>

			<div />
		</div>
	);
};

export default MiddleAndTopControlsLayer;
