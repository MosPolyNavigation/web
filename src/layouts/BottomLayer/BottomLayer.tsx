import {FC, ReactNode, useEffect, useRef, useState} from 'react';
import cl from './BottomLayer.module.scss';
import IconButton from '../../components/buttons/IconButton/IconButton.tsx';
import {IconLink} from '../../associations/IconLink.ts';
import classNames from 'classnames';
import {Layout, State} from '../../associations/enums.ts';
import useOnHideRemover from '../../hooks/useOnHideRemover.ts';
import {useAppStore} from '../../store/useAppStore.ts';

interface BottomLayerProps {
	children?: ReactNode,
}

const BottomLayer: FC<BottomLayerProps> = ({children}) => {
	const activeLayout = useAppStore(state => state.activeLayout)
	const [selectedRoom, changeSelectedRoom] = [useAppStore(state => state.selectedRoom), useAppStore(state => state.changeSelectedRoom)]

	const [bottomCardState, setBottomCardState] = useState<State>(State.HIDDEN);
	const previousState = useRef<State>(bottomCardState);

	useEffect(() => {
		if(activeLayout === Layout.SEARCH) {
			setBottomCardState(State.EXPANDED)
		}
		else if(selectedRoom) {
			setBottomCardState(State.COLLAPSED)
		}
		else {
			setBottomCardState(State.HIDDEN)
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
		[cl.hidden]: (bottomCardState === State.HIDDEN),
		[cl.expandedFromMiddle]: (previousState.current === State.COLLAPSED && bottomCardState === State.EXPANDED),
		[cl.expandedFromHidden]: (previousState.current === State.HIDDEN && bottomCardState === State.EXPANDED),
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
