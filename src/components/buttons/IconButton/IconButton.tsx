import  {FC} from 'react';
import cl from './IconButton.module.scss';
import {IconLink} from '../../../constants/IconLink.ts';
import Icon from '../../common/Icon/Icon.tsx';
import classNames from 'classnames';
import {Color} from '../../../constants/enums.ts';

interface IconButtonProps {
	iconLink: IconLink;
	color?: Color;
	className?: string;
	onClick?: (e) => void,
}

// Можно добавить размеры
const IconButton: FC<IconButtonProps> = ({iconLink, color, onClick, className = ''}) => {
	return (
		<button onClick={onClick} className={classNames(cl.iconButton, className)}>
			<Icon iconLink={iconLink} color={color? color : Color.C4} />
		</button>
	);
};

export default IconButton;
