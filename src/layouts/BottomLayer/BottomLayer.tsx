import {FC, ReactNode, useEffect, useRef, useState} from 'react';
import cl from './BottomLayer.module.scss';
import IconButton from '../../components/buttons/IconButton/IconButton.tsx';
import {IconLink} from '../../associations/IconLink.ts';
import classNames from 'classnames';
import {Layout, CardState} from '../../associations/enums.ts';
import useOnHideRemover from '../../hooks/useOnHideRemover.ts';
import {useAppStore} from '../../store/useAppStore.ts';

interface BottomLayerProps {
	children?: ReactNode,
}

const BottomLayer: FC<BottomLayerProps> = ({children}) => {
	const activeLayout = useAppStore(state => state.activeLayout)
	const [selectedRoom, changeSelectedRoom] = [useAppStore(state => state.selectedRoom), useAppStore(state => state.changeSelectedRoom)]

	const [bottomCardState, setBottomCardState] = useState<CardState>(CardState.HIDDEN);
	const previousState = useRef<CardState>(bottomCardState);

	useEffect(() => {
		if(activeLayout === Layout.SEARCH) {
			setBottomCardState(CardState.EXPANDED)
		}
		else if(selectedRoom) {
			setBottomCardState(CardState.COLLAPSED)
		}
		else {
			setBottomCardState(CardState.HIDDEN)
		}
	}, [selectedRoom, activeLayout]);

	const [isRemoved, removerAnimationEndHandler] = useOnHideRemover(bottomCardState);


	useEffect(() => {
		setTimeout(() => {
			console.log(previousState.current, ' => ', bottomCardState);
			previousState.current = bottomCardState;
		}, 50);
	}, [bottomCardState]);

	if(isRemoved) {
		return null;
	}

	//TODO: переделать на навешивание классов через время
	const layerClassNames = classNames(cl.bottomLayer, {
		[cl.hidden]: (bottomCardState === CardState.HIDDEN),
		[cl.expandedFromMiddle]: (previousState.current === CardState.COLLAPSED && bottomCardState === CardState.EXPANDED),
		[cl.expandedFromHidden]: (previousState.current === CardState.HIDDEN && bottomCardState === CardState.EXPANDED),
	});

	return (
		<div onAnimationEnd={removerAnimationEndHandler} className={layerClassNames}>
			<div className={cl.slider}></div>
			{activeLayout !== Layout.SEARCH && <IconButton
				onClick={() => changeSelectedRoom(null)}
				className={cl.closeBtn}
				iconLink={IconLink.CROSS}
			/>}
			{children}
		</div>
	);
};


export default BottomLayer;
