import {FC, useMemo} from 'react';
import cl from './LeftMenu.module.scss';
import MenuItem from '../../menuopmponents/MenuItem/MenuItem.tsx';
import {IconLink} from '../../../constants/IconLink.ts';
import classNames from 'classnames';
import {BtnName, Color, Layout} from '../../../constants/enums.ts';
import IconButton from '../../buttons/IconButton/IconButton.tsx';
import useOnHideRemover from '../../../hooks/useOnHideRemover.ts';
import {useAppStore} from '../../../store/useAppStore.ts';


const LeftMenu: FC = () => {
	const [activeLayout,controlBtnClickHandler] = [useAppStore(state => state.activeLayout), useAppStore(state => state.controlBtnClickHandler)]

	const isVisible = useMemo(() => activeLayout === Layout.MENU, [activeLayout])
	const [isRemoved, removerAnimationEndHandler] = useOnHideRemover(isVisible);

	if(isRemoved) {
		return null;
	}

	const leftMenuClasses = classNames({
		[cl.leftMenu]: true,
		[cl.hidden]: !isVisible,
	});

	return (
		<div className={leftMenuClasses} onAnimationEnd={removerAnimationEndHandler}>
			<div className={cl.top}>
				<div>Политех Навигация</div>
				<IconButton
					// onClick={() => toggleMenu(ActionName.HIDE)}
					onClick={() => controlBtnClickHandler(BtnName.MENU_CLOSE)}
					iconLink={IconLink.CROSS}
					color={Color.C5}
				/>
			</div>
			<div className={cl.items}>
				<MenuItem text="О сервисе" color={Color.BLUE} iconLink={IconLink.ABOUT} />
				<MenuItem text="Сообщить о проблеме" color={Color.BLUE} iconLink={IconLink.PROBLEM} />
				<MenuItem text="Настройки" color={Color.BLUE} iconLink={IconLink.SETTINGS} />
			</div>
			<div className={cl.bottom}>
				<div className={cl.logo}></div>
				<div>
					Сделано студентами проекта
					<br />
					“Политех-Навигация (ПолиНа)”
				</div>
			</div>
		</div>
	);
};

export default LeftMenu;
