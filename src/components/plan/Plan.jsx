import React from "react";

// components //

import plan from "../../images/plan.svg";
import Button from "../button/Button";

// icons //

import burgerIcon from "../../images/burgerIcon.svg";
import heartIcon from "../../images/heartIcon.svg";
import homeIcon from "../../images/homeIcon.svg";
import FloorScroll from "../floorsScroll/FloorScroll";
import ScaleButton from "../scaleButton/ScaleButton";
import SearchPsevdoInput from "../searchPsevdoInput/SearchPsevdoInput";

const Plan = () => {
  return (
    <div className="plan">
      <div className="plan__wrapper">
        <img className="plan__image" src={plan} alt="plan" />
      </div>
      <div className="text__wrapper">
        <div className="button_wrapper button_burger">
          <Button icon={burgerIcon} />
        </div>
        <span className="text__name">
          Большая Семёновская <br /> Корпус А
        </span>
      </div>
      <div className="button_wrapper button_heart">
        <Button icon={heartIcon} />
      </div>
      <div className="button_wrapper button_home">
        <Button icon={homeIcon} />
      </div>
      <div className="floorScroll_wrapper">
        <FloorScroll />
      </div>
      <div className="scaleButton_wrapper">
        <ScaleButton />
      </div>
      <div className="searchPsevdoInput_wrapper">
        <SearchPsevdoInput />
      </div>
    </div>
  );
};

export default Plan;
