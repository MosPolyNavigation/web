import React, {useEffect} from "react";

import searchBarIcon from "../../images/searchBarIcon.svg";

const SearchBar = ({placeholder, props, searchQuery}) => {
    return (
        <div className="searchBar_packet">
            <input className="openKeyboard" inputMode="text" disbabled/>
            <img src={searchBarIcon} alt="search Icon"/>
            {/*<span className="searchPsevdoInput_span">Поиск...</span>*/}
            <input value={searchQuery} onChange={props} type="text" className="searchBar_input"
                   placeholder={placeholder}/>
        </div>
    );
};

export default SearchBar;
