import React from 'react';

import WaySelectorButton from "../../../buttons/WaySelectorButton/WaySelectorButton.tsx";
import Button from "../../../buttons/LargeButton/Button.tsx";
import {QueryService} from "../../../../models/QueryService.ts";
import {IconLink} from "../../../../constants/IconLink.ts";
import Icon from "../../../common/Icon/Icon.tsx";
import {BtnName, Color, Layout, Size} from "../../../../constants/enums.ts";

import {appStore, useAppStore} from "../../../../store/useAppStore.ts";

import cl from "./WaySelectorsControls.module.scss";
import classNames from "classnames";


function WaySelectorsControls(props) {
    const [activeLayout, controlBtnClickHandler] = [useAppStore(state => state.activeLayout), useAppStore(state => state.controlBtnClickHandler)]

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
                onClick={() => controlBtnClickHandler(BtnName.BOTTOM_RIGHT)}
            />
            <div className={cl.wayInfoContent}>
                <WaySelectorButton text={props.fromWay} baseText={"Откуда"} icon={IconLink.STUDY}
                                   baseIcon={IconLink.FROM}
                                   onClick={() => console.log("Нажатие на кнопку ОТКУДА")}/>
                <button className={cl.swapButton}
                        onClick={() => appStore().setQueryService(new QueryService({swap: true}))}>
                    <Icon iconLink={IconLink.SWAP} color={Color.C3} size={Size.M}/>
                </button>

                <WaySelectorButton text={props.toWay} baseText={"Куда"} icon={IconLink.STUDY}
                                   baseIcon={IconLink.FROM}
                                   onClick={() => console.log("Нажатие на кнопку КУДА")}/>
            </div>

        </div>

    );
}

export default WaySelectorsControls;