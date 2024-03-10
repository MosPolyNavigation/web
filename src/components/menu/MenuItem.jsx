import React from "react";

export const MenuItem = ({ icon, text }) => {
  return (
    <li className="menu__item">
      <button className="menu__button" href="#!">
        <img src={icon} alt={icon} />
        <span>{text}</span>
      </button>
    </li>
  );
};
