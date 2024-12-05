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

const Button: FC<ButtonProps> = (
	{
		iconLink,
		onClick,
		text,
		size,
		color,
		textColor,
		classNameExt,
		disabled,
		current,
	},
) => {
	if(!size) size = Size.M;

	const buttonClasses = classNames(
		cl.button, classNameExt,
		{
			[cl.sizeL]: size === Size.M,
			[cl.sizeS]: size === Size.S,
			[cl.current]: current,
		},
	);

	const textStyle = textColor && {color: textColor};

	return (
		<button
			disabled={disabled}
			className={buttonClasses}
			onClick={onClick}
		>
			{iconLink && <Icon color={color ? color : Color.C4} size={size} iconLink={iconLink} />}
			{text && <span style={textStyle} className={cl.text}>{text}</span>}
		</button>
	);
};

export default Button;
