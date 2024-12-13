import {FC} from 'react';
import {BtnName, Layout} from '../../associations/enums.ts';
import {IconLink} from '../../associations/IconLink.ts';
import classNames from 'classnames';
import cl from './BottomControlsLayer.module.scss';
import Button from '../../components/buttons/LargeButton/Button.tsx';
import SearchButton from '../../components/buttons/SearchButton/SearchButton.tsx';
import {useAppStore} from '../../store/useAppStore.ts';

const BottomControlsLayer: FC = () => {

	const [activeLayout,controlBtnClickHandler] = [useAppStore(state => state.activeLayout), useAppStore(state => state.controlBtnClickHandler)]
	const [selectedRoomId, changeSelectedRoom] = [useAppStore(state => state.selectedRoomId), useAppStore(state => state.changeSelectedRoom)]
	const query = useAppStore(state => state.query);
	console.log(query.to)

	const heartBtnClickHandler = () => {
		if(!selectedRoomId) {
			changeSelectedRoom('n-405')
		}
		else {
			changeSelectedRoom(null)
		}
	};

	const rightBtnClass = classNames({
		[cl.locationsBtn]: (activeLayout !== Layout.SEARCH && activeLayout !== Layout.LOCATIONS),
	});

	const rightBtnIcon = (function() {
		if(activeLayout === Layout.SEARCH || activeLayout === Layout.LOCATIONS) return IconLink.CROSS;
		return IconLink.LOCATIONS;
	})();

	return (
		<div
			className={classNames(cl.bottomControlsLayer, {
				[cl.centered]: !!selectedRoomId && activeLayout !== Layout.SEARCH,
				[cl.searchOpen]: activeLayout === Layout.SEARCH,
			})}
		>
			<Button
				classNameExt={cl.favouriteBtn}
				iconLink={IconLink.HEART}
				onClick={heartBtnClickHandler}
				//КНОПКА С СЕРДЕЧКОМ
			/>
			{activeLayout === Layout.PLAN &&
			<div style={{position: "absolute"}}>
				От: {query.to}
				<br />
				До: {query.from}
			</div>
			}
			<SearchButton
				expanded={activeLayout === Layout.SEARCH}
				onClick={() => controlBtnClickHandler(BtnName.SEARCH)}
			/>
			<Button
				iconLink={rightBtnIcon}
				classNameExt={rightBtnClass}
				onClick={() => controlBtnClickHandler(BtnName.BOTTOM_RIGHT)}
			/>
		</div>
	);
};

export default BottomControlsLayer;
