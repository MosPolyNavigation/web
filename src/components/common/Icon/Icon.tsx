import {FC} from 'react';
import cl from './Icon.module.scss';
import {IconLink} from '../../../associations/IconLink.ts';
import {Color, Size} from '../../../associations/enums.ts';
import classNames from 'classnames';

interface IconProps {
	iconLink: IconLink,
	color?: Color,
	classNameExt?: string,
	size?: Size.M | Size.S,
}

const Icon: FC<IconProps> = ({iconLink, color, classNameExt = '', size = Size.M}) => {
	// Расчет CSS правила для применения картинки, если указан цвет - устанавливает маску, если нет - устанавливает
	// изображение фона

	const iconLinkStyleProperty = (() => {
		const iconUrl = `url(${iconLink})`;
		if(color === Color.INITIAL) {
			return {backgroundImage: iconUrl};
		} else {
			return {maskImage: iconUrl, backgroundColor: color};
		}
	})();

	return (
		<div
			className={classNames(
				cl.icon, classNameExt, {
					[cl.sizeM]: size === Size.M,
					[cl.sizeS]: size === Size.S,
					[cl.initialColor]: color === Color.INITIAL,
				})}
			style={iconLinkStyleProperty}
		/>);
};

export default Icon;
