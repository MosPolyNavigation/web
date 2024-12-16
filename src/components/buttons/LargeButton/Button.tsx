import React, {Attributes, FC} from 'react';
import {IconLink} from '../../../associations/IconLink.ts';
import cl from './Button.module.scss';
import Icon from '../../common/Icon/Icon.tsx';
import {Color, Size} from '../../../associations/enums.ts';
import classNames from 'classnames';

interface ButtonProps extends Attributes {
	iconLink?: IconLink,
	onClick?: (e: React.MouseEvent) => void,
	text?: string,
	size?: Size.M | Size.S,
	color?: Color,
	textColor?: Color,
	classNameExt?: string,
	disabled?: boolean,
	current?: boolean
}

const Button = (props: ButtonProps) => {
	let size = props.size
	if(!props.size) size = Size.M;

	const buttonClasses = classNames(
		cl.button, props.classNameExt,
		{
			[cl.sizeL]: size === Size.M,
			[cl.sizeS]: size === Size.S,
			[cl.current]: props.current,
		},
	);

	const textStyle = props.textColor && {color: props.textColor};

	return (
		<button
			disabled={props.disabled}
			className={buttonClasses}
			onClick={props.onClick}
		>
			{props.iconLink && <Icon color={props.color ? props.color : Color.C4} size={props.size} iconLink={props.iconLink} />}
			{props.text && <span style={textStyle} className={cl.text}>{props.text}</span>}
		</button>
	);
};

export default Button;
