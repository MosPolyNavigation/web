import React from 'react';
import cl from "./Toast.module.scss";
import Icon from "../Icon/Icon.tsx";
import {IconLink} from "../../../constants/IconLink.ts";
import {Color, Size} from "../../../constants/enums.ts";

type Props = {
    text?: string,
}

function Toast(props) {
    return (
        <div
            className={cl.toastWrapper}
        >
            <Icon size={Size.L} classNameExt={cl.toastIcon} iconLink={IconLink.SMILE_SAD} color={Color.INITIAL}/>
            {props.text ?
                <p className={cl.toastText}>{props.text}</p>
                :
                <p className={cl.toastText}>К сожалению, что-то пошло не так</p>}
        </div>
    );
}

export default Toast;