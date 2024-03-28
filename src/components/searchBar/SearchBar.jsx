import React, {useRef, useEffect} from "react";

import searchBarLightIcon from "../../images/searchBarLightIcon.svg";

const SearchBar = ({placeholder, data, isShowSearch, searchQuery}) => {
    const inputRef = useRef(null);
    function setInputFocus() {
        inputRef.current.focus();
    }

    useEffect(() => {
        if (isShowSearch) {
            setTimeout(setInputFocus, 200)
        }
    }, [isShowSearch]);

    return (
        <div className="searchBar_packet">
            <img src={searchBarLightIcon} alt="search Icon"/>
            <input value={searchQuery} ref={inputRef} onChange={data} type="text" className="searchBar_input"
                   placeholder={placeholder} inputMode="text"/>
        </div>
    );
};

export default SearchBar;
