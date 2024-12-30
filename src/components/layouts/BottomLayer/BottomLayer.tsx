import {FC, ReactNode, useEffect, useRef, useState} from 'react';
import cl from './BottomLayer.module.scss';
import IconButton from '../../buttons/IconButton/IconButton.tsx';
import {IconLink} from '../../../constants/IconLink.ts';
import classNames from 'classnames';
import {Layout, CardState} from '../../../constants/enums.ts';
import useOnHideRemover from '../../../hooks/useOnHideRemover.ts';
import {appStore, useAppStore} from '../../../store/useAppStore.ts';

interface BottomLayerProps {
	children?: ReactNode,
}

const BottomLayer: FC<BottomLayerProps> = ({children}) => {
	const activeLayout = useAppStore(state => state.activeLayout)
	const selectedRoomId = useAppStore(state => state.selectedRoomId);
	const queryService = useAppStore(state => state.queryService);

	const [bottomCardState, setBottomCardState] = useState<CardState>(CardState.HIDDEN);
	const previousState = useRef<CardState>(bottomCardState);

	useEffect(() => {
		if (activeLayout === Layout.SEARCH) {
			setBottomCardState(CardState.EXPANDED)
		} else if (selectedRoomId || queryService.steps) {
			setBottomCardState(CardState.COLLAPSED)
		} else {
			setBottomCardState(CardState.HIDDEN)
		}
	}, [selectedRoomId, activeLayout, queryService]);

	const [isRemoved, removerAnimationEndHandler] = useOnHideRemover(bottomCardState);


	useEffect(() => {
		setTimeout(() => {
			// console.log(previousState.current, ' => ', bottomCardState);
			previousState.current = bottomCardState;
		}, 50);
	}, [bottomCardState]);

	// if (isRemoved) {
	// 	return null;
	// }

	//TODO: переделать на навешивание классов через время
	const layerClassNames = classNames(cl.bottomLayer, {
		[cl.hidden]: (bottomCardState === CardState.HIDDEN),
		[cl.expanded]: (bottomCardState === CardState.EXPANDED),
	});

	return (
		<div className={layerClassNames}>
			<div className={cl.slider}></div>
			{(activeLayout !== Layout.SEARCH && !queryService.steps) &&
				<IconButton
					onClick={() => appStore().changeSelectedRoom(null)}
					className={cl.closeBtn}
					iconLink={IconLink.CROSS}
				/>
			}
			{children}
		</div>
	);
};


export default BottomLayer;
