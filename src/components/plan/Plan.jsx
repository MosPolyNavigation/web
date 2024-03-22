import React, {useEffect, useMemo, useState} from "react";
import {
    TransformWrapper,
    TransformComponent,
    useControls,
} from "react-zoom-pan-pinch";

// components //

import plan from "../../images/plan.svg";
import Button from "../button/Button";
import AdditionalInfo from "../additionalInfo/AdditionalInfo";
import FloorScroll from "../floorsScroll/FloorScroll";
import ScaleButton from "../scaleButton/ScaleButton";
import Menu from "../menu/Menu";
import SearchMenu from "../searchMenu/SearchMenu";

// icons //

import burgerIcon from "../../images/burgerIcon.svg";
import heartIcon from "../../images/heartIcon.svg";
import homeIcon from "../../images/homeIcon.svg";
import studyIcon from "../../images/studyIcon.svg";
import legalIcon from "../../images/legalIcon.svg";
import manIcon from "../../images/manIcon.svg"
import womanIcon from "../../images/womanIcon.svg"
import booksIcon from "../../images/booksIcon.svg"
import wcIcon from "../../images/wcIcon.svg"
import foodIcon from "../../images/foodIcon.svg"
import closeLargeIcon from "../../images/closeLargeIcon.svg";
import SearchPsevdoInput from "../searchPsevdoInput/SearchPsevdoInput";

const Plan = () => {
    const [isShowAddInfo, setIsShowAddInfo] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [isActive, setIsActive] = useState(() => {
        return parseInt(localStorage.getItem("activeFloor")) || 0;
    });
    const [isShowSearch, setIsShowSearch] = useState(false);

    useEffect(() => {
        console.log(isShowSearch)
    }, [isShowSearch]);

    useEffect(() => {
        localStorage.setItem("activeFloor", isActive.toString());
    }, [isActive]);

    const countFloors = [1, 2, 3, 4, 5, 6];
    return (
        <div className="plan">
            <div className="plan__wrapper">
                <TransformWrapper>
                    <div className="scaleButton_wrapper">
                        <ScaleButton/>
                    </div>
                    <TransformComponent>
                        <img className="plan__image" src={plan} alt="plan"/>
                    </TransformComponent>
                </TransformWrapper>
            </div>
            {/* <div className="text__wrapper">
        <div
          onClick={() => setIsShowMenu((prev) => !prev)}
          className="button_wrapper button_burger"
        >
          <Button icon={burgerIcon} />
        </div>
        <span className="text__name">
          Большая Семёновская <br /> Корпус А
        </span>
      </div> */}
            <div className="button_wrapper button_burger">
                <div onClick={() => setIsShowMenu((prev) => !prev)}>
                    <Button icon={burgerIcon}/>
                </div>
            </div>
            <div className="boxshadow">

            </div>
            <div className="name__wrapper">
        <span className="text__name">
          Большая Семёновская <br/> Корпус А
        </span>
            </div>
            <div className="floorScroll_wrapper">
                <FloorScroll/>
            </div>
            <div className="common__wrapper">
                <div className="common__wrapper_top">
                    <div className="button_wrapper button_home">
                        <Button icon={homeIcon}/>
                    </div>
                    <div className="searchPsevdoInput_wrapper" onClick={() => setIsShowSearch((prev) => !prev)}>
                        <SearchPsevdoInput/>
                    </div>
                    {/*<div onClick={() => setIsShowSearch((prev) => firstSearchMenuShow(prev))}*/}
                    {/*     className={`searchBar_wrapper ${isShowSearch ? "searchBar_big" : ""}`}>*/}
                    {/*    <SearchBar></SearchBar>*/}
                    {/*</div>*/}
                    <div
                        onClick={() => setIsShowAddInfo((prev) => !prev)}
                        className="button_wrapper button_heart"
                    >
                        <Button icon={heartIcon}/>
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

            <div className={`searchMenu_wrapper ${isShowSearch ? "showSearchMenu" : "hideSearchMenu"}`}>
                <SearchMenu setIsShowSearch={setIsShowSearch} isShowSearch={isShowSearch}/>
            </div>
        </div>
    );
};

export default Plan;
