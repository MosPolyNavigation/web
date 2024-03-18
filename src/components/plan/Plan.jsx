import React, { useState, useEffect } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { Routes, Route } from "react-router-dom";

// components //

import plan from "../../images/plan.svg";
import Button from "../button/Button";
import AdditionalInfo from "../additionalInfo/AdditionalInfo";
import FloorScroll from "../floorsScroll/FloorScroll";
import ScaleButton from "../scaleButton/ScaleButton";
import SearchPsevdoInput from "../searchPsevdoInput/SearchPsevdoInput";

//floors

import FloorOne from "../../floors/FloorOne";
import FloorTwo from "../../floors/FloorTwo";
import FloorThree from "../../floors/FloorThree";
import FloorFour from "../../floors/FloorFour";
import FloorFive from "../../floors/FloorFive";
import FloorSix from "../../floors/FloorSix";

// icons //

import burgerIcon from "../../images/burgerIcon.svg";
import heartIcon from "../../images/heartIcon.svg";
import homeIcon from "../../images/homeIcon.svg";
import Menu from "../menu/Menu";

const Plan = () => {
  const [isShowAddInfo, setIsShowAddInfo] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isActive, setIsActive] = useState(() => {
    return parseInt(localStorage.getItem("activeFloor")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("activeFloor", isActive.toString());
  }, [isActive]);

  const countFloors = [1, 2, 3, 4, 5, 6];

  return (
    <div className="plan">
      <div className="plan__wrapper">
        <TransformWrapper>
          <div className="scaleButton_wrapper">
            <ScaleButton />
          </div>
          <TransformComponent>
            <Routes>
              <Route path={`/floor/1`} element={<FloorOne />} />
              <Route path={`/floor/2`} element={<FloorTwo />} />
              <Route path={`/floor/3`} element={<FloorThree />} />
              <Route path={`/floor/4`} element={<FloorFour />} />
              <Route path={`/floor/5`} element={<FloorFive />} />
              <Route path={`/floor/6`} element={<FloorSix />} />
            </Routes>
          </TransformComponent>
        </TransformWrapper>
      </div>
      <div className="button_wrapper button_burger">
        <div onClick={() => setIsShowMenu((prev) => !prev)}>
          <Button icon={burgerIcon} />
        </div>
      </div>
      <div className="boxshadow"></div>
      <div className="name__wrapper">
        <span className="text__name">
          Большая Семёновская <br /> Корпус А
        </span>
      </div>
      <div className="floorScroll_wrapper">
        <FloorScroll
          countFloors={countFloors}
          isActive={isActive}
          setIsActive={setIsActive}
        />
      </div>
      <div className="common__wrapper">
        <div className="common__wrapper_top">
          <div className="button_wrapper button_home">
            <Button icon={homeIcon} />
          </div>
          <div className="searchPsevdoInput_wrapper">
            <SearchPsevdoInput />
          </div>
          <div
            onClick={() => setIsShowAddInfo((prev) => !prev)}
            className="button_wrapper button_heart"
          >
            <Button icon={heartIcon} />
          </div>
        </div>
        <div
          className={`additionalInfo__wrapper ${
            isShowAddInfo ? "showAddInfo" : "hideAddInfo"
          }`}
        >
          <AdditionalInfo
            isShowAddInfo={isShowAddInfo}
            setIsShowAddInfo={setIsShowAddInfo}
            nameAudience={"Н405 - Аудитория"}
            descAudience={"Корпус Н, 4-й этаж"}
          />
        </div>
      </div>
      <div className={`menu_wrapper ${isShowMenu ? "showMenu" : "hideMenu"}`}>
        <Menu setIsShowMenu={setIsShowMenu} />
      </div>
    </div>
  );
};

export default Plan;
