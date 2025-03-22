import React, { FC } from "react";
import cl from "./MenuItem.module.scss";
import { IconLink } from "../../../constants/IconLink.ts";
import { Color, Size } from "../../../constants/enums.ts";
import Icon from "../../common/Icon/Icon.tsx";
import classNames from "classnames";
import { Link } from "react-router-dom";

interface MenuItemProps {
    isFirst?: boolean;
    iconLink?: IconLink;
    color?: Color;
    text: string;
    addText?: string;
    size?: Size.S | Size.M;
    onClick?: () => void;
    to?: string;
}

const MenuItem: FC<MenuItemProps> = (props: MenuItemProps) => {
    const { to, onClick, ...rest } = props;

    // Если передан `to`, используем Link для навигации
    if (to) {
        return (
            <Link
                to={to}
                className={classNames(cl.menuItem, {
                    [cl.sizeS]: props.size === Size.S,
                })}
            >
                <div className={cl.content}>
                    <div className={cl.basicText}>
                        {props.iconLink && (
                            <Icon
                                iconLink={props.iconLink}
                                color={props.color}
                            />
                        )}
                        {props.text}
                    </div>
                    {props.addText && (
                        <div className={cl.addText}>{props.addText}</div>
                    )}
                </div>
                {!props.isFirst && <div className={cl.divider}></div>}
            </Link>
        );
    }

    // Если `to` не передан, используем обычную кнопку с обработчиком клика
    return (
        <button
            className={classNames(cl.menuItem, {
                [cl.sizeS]: props.size === Size.S,
            })}
            onClick={onClick}
        >
            <div className={cl.content}>
                <div className={cl.basicText}>
                    {props.iconLink && (
                        <Icon iconLink={props.iconLink} color={props.color} />
                    )}
                    {props.text}
                </div>
                {props.addText && (
                    <div className={cl.addText}>{props.addText}</div>
                )}
            </div>
            {!props.isFirst && <div className={cl.divider}></div>}
        </button>
    );
};

export default MenuItem;
