import React, {useMemo, useRef, useEffect} from "react";

import searchBarDarkIcon from "../../images/searchBarDarkIcon.svg.svg";
import searchBarLightIcon from "../../images/searchBarLightIcon.svg";

const SearchBar = ({placeholder, data, isShowSearch, searchQuery}) => {
    const inputRef = useRef(null);
    function setInputFocus() {
        inputRef.current.focus();
    }

    useEffect(() => {
        if (isShowSearch) {
            setTimeout(setInputFocus, 100)
        }
    }, [isShowSearch]);

    return (
        <div className="searchBar_packet">
            {/*<input className="openKeyboard" inputMode="text" disbabled/>*/}
            <img src={searchBarLightIcon} alt="search Icon"/>
            {/*<span className="searchPsevdoInput_span">Поиск...</span>*/}
            <input value={searchQuery} ref={inputRef} onChange={data} type="text" className="searchBar_input"
                   placeholder={placeholder} inputMode="text"/>
        </div>
    );
};

export default SearchBar;
