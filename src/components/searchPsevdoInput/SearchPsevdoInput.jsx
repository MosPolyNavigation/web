import React from "react";

import searchPsevdoIcon from "../../images/searchBarDarkIcon.svg.svg";

const SearchPsevdoInput = () => {
  return (
    <div className="searchPsevdoInput_packet">
      <img src={searchPsevdoIcon} alt="search Psevdo Icon" />
      <input className="searchPsevdoInput_input" placeholder="Поиск..."></input>
    </div>
  );
};

export default SearchPsevdoInput;
