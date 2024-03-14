import React from "react";

import MenuItem from "../menuItem/MenuItem";

//icons

import closeLargeIcon from "../../images/closeLargeIcon.svg";
import serviceIcon from "../../images/serviceIcon.svg";
import problemIcon from "../../images/problemIcon.svg";
import settingsIcon from "../../images/settingsIcon.svg";
import logotype from "../../images/logotype.png";

const Menu = ({ setIsShowMenu }) => {
  return (
    <div className="menu__packet">
      <div className="menu__packet_top">
        <div className="menu__top_text">
          <div className="menu__top_title">
            <h2>Путеводитель Московского Политеха</h2>
          </div>
          <button onClick={() => setIsShowMenu((prev) => !prev)}>
            <img src={closeLargeIcon} alt="closeIcon" />
          </button>
        </div>
        <ul className="menu__top_list">
          <MenuItem icon={serviceIcon}>О сервисе</MenuItem>
          <MenuItem icon={problemIcon}>Сообщить о проблеме</MenuItem>
          <MenuItem icon={settingsIcon}>Настройки</MenuItem>
        </ul>
      </div>
      <div className="menu__packet_bottom">
        <img src={logotype} alt="Moscow Polytechnic University" />
        <span>
          Сделано студентами проекта ”Путеводитель по Московскому Политеху”
        </span>
      </div>
    </div>
  );
};

export default Menu;
