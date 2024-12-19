import {FC, useEffect, useState} from 'react';
import {BtnName, Color, Layout, Pos} from '../../associations/enums.ts';
import {IconLink} from '../../associations/IconLink.ts';
import classNames from 'classnames';
import cl from './BottomControlsLayer.module.scss';
import clButton from '../../components/buttons/LargeButton/Button.module.scss'
import Button from '../../components/buttons/LargeButton/Button.tsx';
import SearchButton from '../../components/buttons/SearchButton/SearchButton.tsx';
import {appStore, useAppStore} from '../../store/useAppStore.ts';
import {Pointer, QueryService} from "../../models/QueryService.ts";

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

	const rightBtnClass = classNames({
		[cl.locationsBtn]: (activeLayout !== Layout.SEARCH && activeLayout !== Layout.LOCATIONS),
	});

	const rightBtnIcon = (function () {
		if (activeLayout === Layout.SEARCH || activeLayout === Layout.LOCATIONS) return IconLink.CROSS;
		return IconLink.LOCATIONS;
	})();

	return (
		<div
			className={classNames(cl.bottomControlsLayer, {
				[cl.centered]: !!selectedRoomId && activeLayout !== Layout.SEARCH,
				[cl.searchOpen]: activeLayout === Layout.SEARCH,
			})}
		>
			{queryService.steps
				? <OnWayControls/>
				: <>
					<Button
						classNameExt={cl.favouriteBtn}
						iconLink={IconLink.HEART}
						onClick={heartBtnClickHandler}
						//КНОПКА С СЕРДЕЧКОМ
					/>
					{activeLayout === Layout.PLAN &&
						<div style={{position: "absolute"}}>
							{/*От: {query.from}*/}
							{/*<br/>*/}
							{/*До: {query.to}*/}
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

function OnWayControls() {
	const queryService = useAppStore(state => state.queryService);
	const planModel = useAppStore(state => state.planModel)
	const {steps, currentStepIndex} = queryService;
	const isLastStep = steps.length <= currentStepIndex + 1
	const [nextBtnText, setNextBtnText] = useState<string>('')
	const [nextBtnIcon, setNextBtnIcon] = useState<IconLink>(null)
	useEffect(() => {
		if (!isLastStep) {
			const currentStep = steps[currentStepIndex];
			const nextStep = steps[currentStepIndex + 1];
			let nextBtnTextBuilder = 'Далее: '
			if (nextStep.plan.corpus === currentStep.plan.corpus) {
				if (nextStep.plan.floor > currentStep.plan.floor) {
					// nextBtnTextBuilder = 'Далее: Подняться '
					setNextBtnIcon(IconLink.ARROW_UP)
				} else {
					// nextBtnTextBuilder = 'Далее: Спуститься '
					setNextBtnIcon(IconLink.ARROW_DOWN)
				}
				nextBtnTextBuilder += `${nextStep.plan.floor}-й этаж`
			} else {
				nextBtnTextBuilder += `Корпус ${nextStep.plan.corpus.title}`
				setNextBtnIcon(IconLink.ARROW_RIGHT)
			}
			setNextBtnText(nextBtnTextBuilder)
		}
	}, [planModel]);


	return <>
		<Button iconLink={IconLink.CROSS} onClick={() => appStore().setQueryService(new QueryService({from: Pointer.NOTHING, to: Pointer.NOTHING}))}/>
		{currentStepIndex !== 0 && <Button iconLink={IconLink.ARROW_LEFT}
		         classNameExt={classNames(cl.backBtn, {
			         [cl.backBtnForceRight]: isLastStep,
		         })}
		         onClick={() => queryService.previousStep()}
		/>}
		<Button classNameExt={classNames({[clButton.invisible]: isLastStep})}
		        iconLink={nextBtnIcon} text={nextBtnText}
		        textColor={Color.C4} textPosition={Pos.LEFT}
		        onClick={() => queryService.nextStep()}
		/>
	</>;
}