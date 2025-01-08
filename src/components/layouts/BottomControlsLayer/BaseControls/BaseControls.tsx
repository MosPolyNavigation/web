import React from 'react';
import Button from "../../../buttons/LargeButton/Button.tsx";
import cl from "../BottomControlsLayer.module.scss";
import {IconLink} from "../../../../constants/IconLink.ts";
import {BtnName, Layout} from "../../../../constants/enums.ts";
import SearchButton from "../../../buttons/SearchButton/SearchButton.tsx";
import {useAppStore} from "../../../../store/useAppStore.ts";
import classNames from "classnames";
import {useStore} from "../../../../store/rootStoreContext.ts";


function BaseControls() {
    const [activeLayout, controlBtnClickHandler] = [useAppStore(state => state.activeLayout), useAppStore(state => state.controlBtnClickHandler)]
    const [selectedRoomId, changeSelectedRoom] = [useAppStore(state => state.selectedRoomId), useAppStore(state => state.changeSelectedRoom)]
    const {appStore} = useStore()

    const heartBtnClickHandler = () => {
        appStore.toast.showForTime()
    };

    const rightBtnClass = classNames({
        [cl.locationsBtn]: (activeLayout !== Layout.SEARCH && activeLayout !== Layout.LOCATIONS),
    });

    const rightBtnIcon = (function () {
        if (activeLayout === Layout.SEARCH || activeLayout === Layout.LOCATIONS) return IconLink.CROSS;
        return IconLink.LOCATIONS;
    })();

    return (
        <>
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
        </>
    );
}

export default BaseControls;