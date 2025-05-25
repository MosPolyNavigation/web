import {FC} from 'react';
import cl from './ScaleControl.module.scss';
import Icon from '../../common/Icon/Icon.tsx';
import {IconLink} from '../../../constants/IconLink.ts';
import {Color} from '../../../constants/enums.ts';
import {appStore} from "../../../store/useAppStore.ts";

interface ScaleControlProps {
	onClick?: () => void;
}

// noinspection JSUnusedLocalSymbols
const ScaleControl: FC<ScaleControlProps> = ({onClick}) => {
	return (
		<div className={cl.scaleControl}>
			<button className={cl.scaleButton} onClick={() => appStore().controlsFunctions.zoomIn()}>
				<Icon iconLink={IconLink.PLUS} color={Color.C4}/>
			</button>
			<button className={cl.scaleButton} onClick={() => appStore().controlsFunctions.zoomOut()}>
				<Icon iconLink={IconLink.MINUS} color={Color.C4}/>
			</button>
		</div>
	);
};

export default ScaleControl;
