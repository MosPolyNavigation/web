import React from "react";

import searchBarIcon from "../../images/searchBarIcon.svg";

const SearchBar = ({placeholder}) => {
    return (
        <div className="searchBar_packet">
            <img src={searchBarIcon} alt="search Icon"/>
            {/*<span className="searchPsevdoInput_span">Поиск...</span>*/}
            <input type="text" className="searchBar_input" placeholder={placeholder} inputMode="text"/>
        </div>
    );
};

export default SearchBar;
