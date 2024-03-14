import React, { useState } from "react";

// components //

import plan from "../../images/plan.svg";
import Button from "../button/Button";
import AdditionalInfo from "../additionalInfo/AdditionalInfo";
import FloorScroll from "../floorsScroll/FloorScroll";
import ScaleButton from "../scaleButton/ScaleButton";
import SearchPsevdoInput from "../searchPsevdoInput/SearchPsevdoInput";

// icons //

import burgerIcon from "../../images/burgerIcon.svg";
import heartIcon from "../../images/heartIcon.svg";
import homeIcon from "../../images/homeIcon.svg";
import Menu from "../menu/Menu";

const Plan = () => {
  const [isShowAddInfo, setIsShowAddInfo] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);

  return (
    <div className="plan">
      <div className="plan__wrapper">
        <img className="plan__image" src={plan} alt="plan" />
      </div>
      <div className="text__wrapper">
        <div
          onClick={() => setIsShowMenu((prev) => !prev)}
          className="button_wrapper button_burger"
        >
          <Button icon={burgerIcon} />
        </div>
        <span className="text__name">
          Большая Семёновская <br /> Корпус А
        </span>
      </div>
      <div className="floorScroll_wrapper">
        <FloorScroll />
      </div>
      <div className="scaleButton_wrapper">
        <ScaleButton />
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
        <Menu setIsShowMenu={setIsShowMenu}/>
      </div>
    </div>
  );
};

export default Plan;
