import React, {FC, useEffect} from 'react';
import cl from './MenuItem.module.scss';
import {IconLink} from '../../../associations/IconLink.ts';
import {Color, Size} from '../../../associations/enums.ts';
import Icon from '../../common/Icon/Icon.tsx';
import classNames from 'classnames';

interface MenuItemProps {
	isFirst?: boolean;
	iconLink?: IconLink;
	color?: Color;
	text: string;
	addText?: string;
	size?: Size.S | Size.M
}

const MenuItem: FC<MenuItemProps> = ({isFirst, iconLink, color, text, addText, size= Size.M}) => {

	return (
		<button className={classNames(cl.menuItem, {[cl.sizeS]: size === Size.S})} >
			{!isFirst && <div className={cl.divider}></div>}

			<div className={cl.content}>

				<div className={cl.basicText}>
					{iconLink && <Icon iconLink={iconLink} color={color} />}
					{text}
				</div>

				{addText && <div className={cl.addText}>
					{addText}
				</div>}

			</div>
		</button>
	);
};

export default MenuItem;
