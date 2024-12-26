import React from 'react';
import cl from './WayInfo.module.scss'
import WaySelectorButton from "../../../buttons/WaySelectorButton/WaySelectorButton.tsx";
import {IconLink} from "../../../../constants/IconLink.ts";
import {Color, Size} from "../../../../constants/enums.ts";
import Icon from "../../../common/Icon/Icon.tsx";

type Props = {
    fromWay: {fromIcon: IconLink, text: string},
    toWay: {toIcon: IconLink, text: string},
    steps: {stepIcon: IconLink, stepText: string}[]
}

function WayInfo(props: Props) {
    return (
        <div className={cl.wayInfoWrapper}>
            <div className={cl.wayInfoContent}>
                <WaySelectorButton text={"H 405 (Аудитория)"} baseText={"Откуда"} icon={IconLink.STUDY}
                                   baseIcon={IconLink.FROM} onClick={() => console.log("Нажатие на кнопку ОТКУДА")}/>
                <button className={cl.swapButton} onClick={() => console.log("Нажатие на кнопку смены локаций")}>
                    <Icon iconLink={IconLink.SWAP} color={Color.C3} size={Size.M}/>
                </button>

                <WaySelectorButton text={"H 405 (Аудитория)"} baseText={"Откуда"} icon={IconLink.STUDY}
                                   baseIcon={IconLink.FROM} onClick={() => console.log("Нажатие на кнопку КУДА")}/>
            </div>
            {/*<div className={cl.wayInfoContent}>*/}
            {/*    <WaySelectorButton baseText={"Откуда"} baseIcon={IconLink.FROM} onClick={() => console.log("Нажатие на кнопку ОТКУДА")}/>*/}
            {/*    <button className={cl.swapButton} onClick={() => console.log("Нажатие на кнопку смены локаций")}>*/}
            {/*        <Icon iconLink={IconLink.SWAP} color={Color.C3} size={Size.M}/>*/}
            {/*    </button>*/}

            {/*    <WaySelectorButton baseText={"Куда"} baseIcon={IconLink.TO} onClick={() => console.log("Нажатие на кнопку КУДА")}/>*/}
            {/*</div>*/}

            <div className={cl.waySteps}>
                <ul className={cl.wayStepsList}>
                    <li className={cl.wayStepsItem}>
                        <Icon classNameExt={cl.wayStepsIcon} iconLink={IconLink.FROM} color={Color.INITIAL}/>
                        <p className={cl.wayStepsText}>{props.fromWay.text}</p>
                    </li>
                    {props.steps.map((step, index) => (
                        <li key={index} className={cl.wayStepsItem}>
                            <Icon classNameExt={cl.wayStepsIcon} iconLink={step.stepIcon} color={Color.INITIAL}/>
                            <p className={cl.wayStepsText}>{step.stepText}</p>
                        </li>
                    ))}
                    <li className={cl.wayStepsItem}>
                        <Icon classNameExt={cl.wayStepsIcon} iconLink={IconLink.TO} color={Color.INITIAL}/>
                        <p className={cl.wayStepsText}>{props.toWay.text}</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default WayInfo;

