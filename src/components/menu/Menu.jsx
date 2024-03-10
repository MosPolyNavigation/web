import React from "react";

import closeIcon from "./closeIcon.svg";
import serviceIcon from "./serviceIcon.svg";
import problemIcon from "./problemIcon.svg";
import settingsIcon from "./settingsIcon.svg";
import logotype from "./logotype.png";
import { MenuItem } from "./MenuItem";

export const Menu = ({ setIsShowMenu }) => {
  return (
    <>
      <div className="menu__wrapper">
        <div className="menu">
          <button
            onClick={() => setIsShowMenu((prev) => !prev)}
            className="menu__button_close"
          >
            <svg
              width="60.000000"
              height="60.000000"
              viewBox="0 0 60 60"
              fill="none"
            >
              <defs />
              <path
                id="Vector 197"
                d="M13 13L47 47"
                stroke="rgb(19, 20, 22)"
                stroke-opacity="1.000000"
                stroke-width="5.000000"
                stroke-linecap="round"
                fill="none"
              />
              <path
                id="Vector 198"
                d="M47 13L13 47"
                stroke="rgb(19, 20, 22)"
                stroke-opacity="1.000000"
                stroke-width="5.000000"
                stroke-linecap="round"
                fill="none"
              />
            </svg>
          </button>
          <div className="menu__title">
            <h3 className="title3 title3_menu">
              Путеводитель Московского Политеха
            </h3>
          </div>
          <ul className="menu__list">
            <MenuItem icon={serviceIcon} text={"О сервисе"} />
            <MenuItem icon={problemIcon} text={"Сообщить о проблеме"} />
            <MenuItem icon={settingsIcon} text={"Настройки"} />
          </ul>
        </div>
        <div className="menu__info">
          <div className="menu__logotype">
            <img src={logotype} alt="logotype" />
          </div>
          <span className="menu__text">
            Сделано студентами проекта “Путеводитель по Московскому Политеху”
          </span>
        </div>
      </div>
    </>
  );
};
