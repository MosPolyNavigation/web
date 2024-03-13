import React from "react";

import searchPsevdoIcon from "../../images/searchPsevdoIcon.svg";

const SearchPsevdoInput = () => {
  return (
    <div className="searchPsevdoInput_packet">
      <img src={searchPsevdoIcon} alt="search Psevdo Icon" />
      <span className="searchPsevdoInput_span">Поиск...</span>
    </div>
  );
};

export default SearchPsevdoInput;
