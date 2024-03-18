import React, {useState} from "react";
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
import SearchBar from "../searchBar/SearchBar";
import AudienceItem from "../audienceItem/AudienceItem";

// icons //

import burgerIcon from "../../images/burgerIcon.svg";
import heartIcon from "../../images/heartIcon.svg";
import homeIcon from "../../images/homeIcon.svg";
import studyIcon from "../../images/studyIcon.svg";
import legalIcon from "../../images/legalIcon.svg";
import Menu from "../menu/Menu";
import AudienceList from "../audienceList/AudienceList";
import PopularLocations from "../popularLocations/PopularLocations";

const Plan = () => {
    const [isShowAddInfo, setIsShowAddInfo] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [isShowSearch, setIsShowSearch] = useState(false);

    const name = "123";
    const desc = "123";
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
                    <div onClick={() => console.log(123)}
                         className="searchBar_wrapper">
                        <SearchBar
                            isShowSearch={isShowSearch}
                            setIsShowSearch={setIsShowSearch}
                            placeholder="Поиск..."
                        />
                    </div>
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
        </div>
    );
};

export default Plan;
