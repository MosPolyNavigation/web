import React from "react";

import searchBarDarkIcon from "../../images/searchBarDarkIcon.svg.svg";
import searchBarLightIcon from "../../images/searchBarLightIcon.svg";

const SearchBar = ({placeholder, data, searchQuery}) => {
    return (
        <div className="searchBar_packet">
            {/*<input className="openKeyboard" inputMode="text" disbabled/>*/}
            <img src={searchBarLightIcon} alt="search Icon"/>
            {/*<span className="searchPsevdoInput_span">Поиск...</span>*/}
            <input value={searchQuery} onChange={data} type="text" className="searchBar_input"
                   placeholder={placeholder} inputMode="text"/>
        </div>
    );
};

export default SearchBar;
