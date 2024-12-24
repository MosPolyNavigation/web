import {FC, useEffect, useRef, useState} from 'react';
import cl from './SearchMenu.module.scss';
import {IconLink} from '../../../../constants/IconLink.ts';
import Button from '../../../buttons/LargeButton/Button.tsx';
import {Color, Size} from '../../../../constants/enums.ts';
import MenuItem from '../../../menuopmponents/MenuItem/MenuItem.tsx';

interface SearchMenuProps {
	a?: boolean
}

const SearchMenu: FC<SearchMenuProps> = () => {
	const resultsRef = useRef<HTMLDivElement | null>(null)
	const [results, setResults] = useState(false);

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

	return (
		<div className={cl.searchMenu}>

			<div ref={resultsRef} className={cl.results}>
				<MenuItem text='Н 505' iconLink={IconLink.STUDY} {...resultProps} />
				<MenuItem text='Н 409' addText='Приёмная комиссия' iconLink={IconLink.LEGAL} {...resultProps} />
				<MenuItem text='Н 408' addText='Приём заявлений приёмной комиссии' iconLink={IconLink.LEGAL} {...resultProps} />
				<MenuItem text='Н 407' addText='' iconLink={IconLink.LEGAL} {...resultProps} />
				<MenuItem text='Н 416' addText='Библиотека' iconLink={IconLink.BOOK} {...resultProps} />
				<MenuItem text='Н 406' iconLink={IconLink.STUDY} {...resultProps} />
				<MenuItem text='Н 405' iconLink={IconLink.STUDY} {...resultProps} />
				<MenuItem isFirst text='Н 402' iconLink={IconLink.LEGAL} addText='Волонтерский центр' {...resultProps} />

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
