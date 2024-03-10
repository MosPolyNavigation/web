import React from "react";

import searchIcon from "./searchIcon.svg";

export const SearchInput = () => {
  return (
    <>
      <button className="button__search">
        <img className="search__image" src={searchIcon} alt="search icon" />
        <span className="search__text">Поиск...</span>
      </button>
    </>
  );
};
