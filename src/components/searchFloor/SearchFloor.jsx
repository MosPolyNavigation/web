import React from "react";

import searchIcon from "./searchIcon.svg";

export const SearchFloor = () => {
  return (
    <div className="floor__row">
      <img src={searchIcon} alt="search icon" />
      <input type="text" placeholder="Поиск..." />
    </div>
  );
};
