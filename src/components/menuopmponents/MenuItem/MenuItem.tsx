import React, {FC} from 'react';
import cl from './MenuItem.module.scss';
import {IconLink} from '../../../constants/IconLink.ts';
import {Color, Size} from '../../../constants/enums.ts';
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

const MenuItem: FC<MenuItemProps> = (props: MenuItemProps) => {

	return (
		<button className={classNames(cl.menuItem, {[cl.sizeS]: props.size === Size.S})} >
			{!props.isFirst && <div className={cl.divider}></div>}

			<div className={cl.content}>

				<div className={cl.basicText}>
					{props.iconLink && <Icon iconLink={props.iconLink} color={props.color} />}
					{props.text}
				</div>

				{props.addText && <div className={cl.addText}>
					{props.addText}
				</div>}

			</div>
		</button>
	);
};

export default MenuItem;
