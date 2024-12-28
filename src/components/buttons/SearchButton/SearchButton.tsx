// noinspection TypeScriptCheckImport
import React, {FC, useEffect, useRef} from 'react';
import cl from './SearchButton.module.scss';
import Icon from '../../common/Icon/Icon.tsx';
import {IconLink} from '../../../constants/IconLink.ts';
import {Color} from '../../../constants/enums.ts';
import classNames from 'classnames';
import {appStore, useAppStore} from "../../../store/useAppStore.ts";

interface SearchButtonProps {
	onClick: () => void,
	classNameExt?: string,
	expanded: boolean
}

const SearchButton: FC<SearchButtonProps> = ({onClick, classNameExt, expanded}) => {
	return (
		<div className={classNames(cl.searchButtonWrapper, {[cl.expanded]: expanded})}>
			<div className={cl.filler}></div>

			<button onClick={!expanded ? onClick : null} className={classNames(cl.searchButton, classNameExt)}>
				<div className={cl.secondStroke}>
					<div className={classNames(cl.filler, cl.fillerInner)}></div>

					<Icon classNameExt={cl.searchIcon} iconLink={IconLink.SEARCH} color={!expanded ? Color.C3 : Color.C4} />
					<div className={cl.searchText}>Поиск...</div>

					<SearchInput expanded={expanded} />
				</div>
			</button>

		</div>
	);
};

type Props = {
	expanded: boolean;
}

const SearchInput = (props: Props) => {
	const searchQuery = useAppStore(state => state.searchQuery);

	useEffect(() => {
		if(props.expanded) {
			setTimeout(() => {
				inputRef.current.focus();
			}, 175);
		}
	}, [props.expanded]);

	const inputRef = useRef(null);

	return <>
		<label htmlFor="search"></label>
		<input
			ref={inputRef}
			autoComplete="off"
			placeholder={'Поиск...'}
			type="text"
			name="search"
			id="search"
			onChange={(e) => appStore().setSearchQuery(e.target.value)}
			value={searchQuery}
		/>
	</>;
};

export default SearchButton;
