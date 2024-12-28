import {FC, useEffect, useMemo, useRef, useState} from 'react';
import cl from './SearchMenu.module.scss';
import {IconLink} from '../../../../constants/IconLink.ts';
import Button from '../../../buttons/LargeButton/Button.tsx';
import {Color, Layout, Size} from '../../../../constants/enums.ts';
import MenuItem from '../../../menuopmponents/MenuItem/MenuItem.tsx';
import {useDataStore} from "../../../../store/useDataStore.ts";
import {appStore, useAppStore} from "../../../../store/useAppStore.ts";
import {RoomData} from "../../../../constants/types.ts";

interface SearchMenuProps {
	a?: boolean
}

const SearchMenu: FC<SearchMenuProps> = () => {
	const rooms = useDataStore(state => state.rooms)
	const resultsRef = useRef<HTMLDivElement | null>(null)
	const [results, setResults] = useState(false);
	const searchQuery = useAppStore(state => state.searchQuery);

	const finalSearchQuery = useMemo(() => {
		return searchQuery.toLowerCase().replaceAll(' ','').replaceAll('-','')
	}, [searchQuery])

	// Сбрасываем результаты через полсекунды
	useEffect(() => {
		setTimeout(()=> {
			setResults(true)
		}, 500)
	}, []);

	const actionBtnsProps = {
		size: Size.S as Size.S,
		color: Color.INITIAL
	}

	const resultProps = {
		color: Color.INITIAL,
		size: Size.S as Size.S
	}

	// При изменении результатов скролл вниз
	useEffect(() => {
		if(results){
			if(resultsRef.current) {
				resultsRef.current.scrollTo(0,0)
			}
		}
	}, [resultsRef, results]);

	function menuItemClickHandler(room: RoomData) {
		appStore().changeCurrentPlan(room.plan)
		appStore().changeSelectedRoom(room.id)
		appStore().changeLayout(Layout.PLAN)
	}

	return (
		<div className={cl.searchMenu}>

			<div ref={resultsRef} className={cl.results}>
				{
					searchQuery &&
					rooms.filter(room => (
						room.title.toLowerCase().replaceAll(' ','').replaceAll('-','').includes(searchQuery)
						|| room.subTitle.toLowerCase().replaceAll(' ','').replaceAll('-','').includes(searchQuery))
					).sort((a, b) => b.title.length - a.title.length)
						.map((room, index) =>
					<MenuItem onClick={() => menuItemClickHandler(room)} text={room.title} addText={room.subTitle}
					          iconLink={room.icon} isFirst={index === 0} {...resultProps}
					/>
				)
				}
			</div>

			<div className={cl.quickActions}>
				<Button iconLink={IconLink.WOMAN} {...actionBtnsProps}/>
				<Button iconLink={IconLink.MEN} {...actionBtnsProps}/>
				<Button iconLink={IconLink.BOOK} {...actionBtnsProps}/>
				<Button iconLink={IconLink.ENTER} text='Вход' {...actionBtnsProps}/>
				<Button iconLink={IconLink.ACT} text='А 100' {...actionBtnsProps}/>
				<Button iconLink={IconLink.FOOD} text='Б 2 этаж' {...actionBtnsProps}/>
			</div>

		</div>
	);
};

export default SearchMenu;
