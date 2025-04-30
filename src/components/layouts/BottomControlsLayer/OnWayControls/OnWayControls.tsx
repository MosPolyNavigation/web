import React, {useEffect, useState} from "react";

import Button from "../../../buttons/LargeButton/Button.tsx";
import {Pointer, QueryService} from "../../../../models/QueryService.ts";
import {Color, Pos} from "../../../../constants/enums.ts";
import {IconLink} from "../../../../constants/IconLink.ts";

import {appStore, useAppStore} from "../../../../store/useAppStore.ts";

import classNames from "classnames";
import cl from "./OnWayControls.module.scss";
import clButton from "../../../buttons/LargeButton/Button.module.scss";


function OnWayControls() {
	const queryService = useAppStore(state => state.queryService);
	const planModel = useAppStore(state => state.planModel)
	const {steps, currentStepIndex} = queryService;
	const isLastStep = steps && currentStepIndex && steps.length <= currentStepIndex + 1
	const [nextBtnText, setNextBtnText] = useState<string>('')
	const [nextBtnIcon, setNextBtnIcon] = useState<IconLink | null>(null)

	useEffect(() => {
		if (!isLastStep) {
			if(!currentStepIndex || !steps) {
				setNextBtnIcon(null)
				setNextBtnText('')
				return
			}
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
	}, [currentStepIndex, isLastStep, planModel, steps]);

	if(!nextBtnIcon) {
		return null
	}


	return <>
		<Button iconLink={IconLink.CROSS} onClick={() => appStore().setQueryService(new QueryService({from: Pointer.NOTHING, to: Pointer.NOTHING}))}/>
		{currentStepIndex !== 0 &&
			<Button
				iconLink={IconLink.BACK}
				classNameExt={classNames(cl.backBtn, {
					[cl.backBtnForceRight]: isLastStep,
				})}
				onClick={() => queryService.previousStep()}
			/>
		}
		<Button classNameExt={classNames({[clButton.invisible]: isLastStep})}
		        iconLink={nextBtnIcon} text={nextBtnText}
		        textColor={Color.C4} textPosition={Pos.LEFT}
		        onClick={() => queryService.nextStep()}
		/>
	</>;
}


export default OnWayControls;