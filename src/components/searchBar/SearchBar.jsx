import React, {useEffect} from "react";

import searchBarDarkIcon from "../../images/searchBarDarkIcon.svg.svg";
import searchBarLightIcon from "../../images/searchBarLightIcon.svg";

const SearchBar = ({placeholder, props, searchQuery, isShowSearch}) => {
    return (
        <div className="searchBar_packet">
            {/*<input className="openKeyboard" inputMode="text" disbabled/>*/}
            <img src={isShowSearch ? searchBarLightIcon : searchBarDarkIcon} alt="search Icon"/>
            {/*<span className="searchPsevdoInput_span">Поиск...</span>*/}
            <input value={searchQuery} onChange={props} type="text" className="searchBar_input"
                   placeholder={placeholder} inputMode="text"/>
        </div>
    );
};

export default SearchBar;
