import React, { useState } from "react";

import { LargeButton } from "../largeButton/LargeButton";
import { FloorScroll } from "../floorsScroll/FloorScroll";
import { ButtonZoom } from "../buttonZoom/ButtonZoom";
import { SearchInput } from "../searchInput/SearchInput";
import { Menu } from "../menu/Menu";
// import planImage from "../../images/plan.svg";
import planImageTwo from "../../images/planNew.svg";

export const Plan = () => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  return (
    <div>
      <div className="overlay overlay_shadow"></div>
      <div
        className={`overlay overlay_menu ${
          isShowMenu
            ? "overlay_menu-window-animationShow"
            : "overlay_menu-window-animationHide"
        }`}
      ></div>
      <div className="plan">
        <div className="plan__wrapper">
          <img className="plan__image" src={planImageTwo} alt="plan" />
        </div>
        <div
          onClick={() => setIsShowMenu((prev) => !prev)}
          className="plan__item plan__item_menu-button"
        >
          <LargeButton
            icon={
              <svg
                width="60.000000"
                height="60.000000"
                viewBox="0 0 60 60"
                fill="none"
              >
                <defs />
                <rect
                  id="Menu"
                  width="60.000000"
                  height="60.000000"
                  fill="#FFFFFF"
                  fillOpacity="0"
                />
                <path
                  id="Vector 201"
                  d="M2.5 12.5L57.5 12.5"
                  stroke="#A0A4AD"
                  strokeOpacity="1.000000"
                  strokeWidth="5.000000"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <path
                  id="Vector 202"
                  d="M2.5 30L57.5 30"
                  stroke="#A0A4AD"
                  strokeOpacity="1.000000"
                  strokeWidth="5.000000"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <path
                  id="Vector 203"
                  d="M2.5 48L57.5 48"
                  stroke="#A0A4AD"
                  strokeOpacity="1.000000"
                  strokeWidth="5.000000"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            }
            iconClass={"menu-btn"}
          />
        </div>
        <div className="plan__item plan__item_name">
          <span>
            Корпус А <br />
            Большая Семёновская
          </span>
        </div>
        <div className="plan__item plan__item_floorScroll">
          <FloorScroll />
        </div>
        <div className="plan__item plan__item_zoom-button">
          <ButtonZoom />
        </div>
        <div className="plan__row">
          <div className="plan__item plan__item_heart-button">
            <LargeButton
              icon={
                <svg
                  width="60.000000"
                  height="60.000000"
                  viewBox="0 0 60 60"
                  fill="none"
                >
                  <defs />
                  <rect
                    id="Heart"
                    width="60.000000"
                    height="60.000000"
                    fill="#FFFFFF"
                    fillOpacity="0"
                  />
                  <path
                    id="Vector"
                    d="M43.7444 4C40.9304 4.04395 38.1777 4.8291 35.7646 6.27734C33.3513 7.7251 31.3628 9.78418 30 12.2466C28.6372 9.78418 26.6487 7.7251 24.2354 6.27734C21.8223 4.8291 19.0696 4.04395 16.2556 4C11.7698 4.19482 7.54321 6.15723 4.49976 9.4585C1.45605 12.7593 -0.157227 17.1309 0.012207 21.6177C0.012207 32.981 11.9722 45.3906 22.0032 53.8047C24.2429 55.687 27.0745 56.7188 30 56.7188C32.9255 56.7188 35.7571 55.687 37.9968 53.8047C48.0278 45.3906 59.9878 32.981 59.9878 21.6177C60.1572 17.1309 58.5439 12.7593 55.5002 9.4585C52.4568 6.15723 48.2302 4.19482 43.7444 4ZM34.7856 49.9814C33.446 51.1094 31.7512 51.728 30 51.728C28.2488 51.728 26.554 51.1094 25.2144 49.9814C12.3745 39.2085 5.01001 28.8726 5.01001 21.6177C4.83936 18.4561 5.92554 15.355 8.03223 12.9907C10.1389 10.6265 13.095 9.19141 16.2556 8.99805C19.4163 9.19141 22.3721 10.6265 24.4788 12.9907C26.5854 15.355 27.6719 18.4561 27.501 21.6177C27.501 22.2808 27.7644 22.9165 28.2329 23.3848C28.7017 23.8535 29.3372 24.1167 30 24.1167C30.6628 24.1167 31.2983 23.8535 31.7671 23.3848C32.2356 22.9165 32.499 22.2808 32.499 21.6177C32.3281 18.4561 33.4146 15.355 35.5212 12.9907C37.6279 10.6265 40.5837 9.19141 43.7444 8.99805C46.905 9.19141 49.8611 10.6265 51.9678 12.9907C54.0745 15.355 55.1606 18.4561 54.99 21.6177C54.99 28.8726 47.6255 39.2085 34.7856 49.9717L34.7856 49.9814Z"
                    fill="#A0A4AD"
                    fillOpacity="1.000000"
                    fillRule="nonzero"
                  />
                </svg>
              }
              iconClass={"heart"}
            />
          </div>
          <div className="plan__item plan__item_searchFloor">
            <SearchInput />
          </div>
          <div className="plan__item plan__home-button">
            <LargeButton
              icon={
                <svg
                  width="60.000000"
                  height="60.000000"
                  viewBox="0 0 60 60"
                  fill="none"
                >
                  <defs />
                  <rect
                    id="Home"
                    width="60.000000"
                    height="60.000000"
                    fill="#FFFFFF"
                    fillOpacity="0"
                  />
                  <path
                    id="Vector"
                    d="M57.8025 22.6191L38.8401 3.6543C36.4932 1.31396 33.3142 0 30 0C26.6858 0 23.5068 1.31396 21.1599 3.6543L2.19751 22.6191C1.49854 23.3135 0.944336 24.1396 0.567139 25.0498C0.189941 25.9604 -0.00268555 26.936 0 27.9214L0 52.4639C0 54.4531 0.790283 56.3608 2.19678 57.7671C3.60327 59.1738 5.51099 59.9639 7.5 59.9639L52.5 59.9639C54.489 59.9639 56.3967 59.1738 57.8032 57.7671C59.2097 56.3608 60 54.4531 60 52.4639L60 27.9214C60.0027 26.936 59.8101 25.9604 59.4329 25.0498C59.0557 24.1396 58.5015 23.3135 57.8025 22.6191ZM37.5 54.9639L22.5 54.9639L22.5 45.1289C22.5 43.1401 23.2903 41.2324 24.6968 39.8257C26.1033 38.4194 28.011 37.6289 30 37.6289C31.989 37.6289 33.8967 38.4194 35.3032 39.8257C36.7097 41.2324 37.5 43.1401 37.5 45.1289L37.5 54.9639ZM55 52.4639C55 53.127 54.7366 53.7627 54.2678 54.2319C53.7988 54.7007 53.1631 54.9639 52.5 54.9639L42.5 54.9639L42.5 45.1289C42.5 41.814 41.1831 38.6343 38.8389 36.29C36.4946 33.9458 33.3152 32.6289 30 32.6289C26.6848 32.6289 23.5054 33.9458 21.1611 36.29C18.8169 38.6343 17.5 41.814 17.5 45.1289L17.5 54.9639L7.5 54.9639C6.83691 54.9639 6.20117 54.7007 5.73218 54.2319C5.26343 53.7627 5 53.127 5 52.4639L5 27.9214C5.00244 27.2588 5.26538 26.624 5.73242 26.1538L24.6951 7.19678C26.1042 5.79395 28.0117 5.00635 30 5.00635C31.9883 5.00635 33.8958 5.79395 35.3049 7.19678L54.2676 26.1616C54.7327 26.6299 54.9956 27.2617 55 27.9214L55 52.4639Z"
                    fill="#A0A4AD"
                    fillOpacity="1.000000"
                    fillRule="nonzero"
                  />
                </svg>
              }
              iconClass={"home"}
            />
          </div>
        </div>
        <div
          className={`plan__item plan__menu-window ${
            isShowMenu
              ? "plan__menu-window-animationShow"
              : "plan__menu-window-animationHide"
          }`}
        >
          <Menu setIsShowMenu={setIsShowMenu} />
        </div>
      </div>
    </div>
  );
};
