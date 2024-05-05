import React, {useEffect, useMemo, useState} from "react";
import {
    TransformWrapper,
    TransformComponent,
    useControls,
} from "react-zoom-pan-pinch";
import {Routes, Route, Navigate} from "react-router-dom";

// components //
import Button from "../button/Button";
import AdditionalInfo from "../additionalInfo/AdditionalInfo";
import FloorScroll from "../floorsScroll/FloorScroll";
import ScaleButton from "../scaleButton/ScaleButton";
import Menu from "../menu/Menu";
import SearchMenu from "../searchMenu/SearchMenu";
import SearchPsevdoInput from "../searchPsevdoInput/SearchPsevdoInput";
import CampusMenu from "../campusMenu/CampusMenu";
import ComeBackHeader from "../comeBackHeader/ComeBackHeader";


//floors
import FloorZero from "../../floors/FloorZero";
import FloorOne from "../../floors/FloorOne";
import FloorTwo from "../../floors/FloorTwo";
import FloorThree from "../../floors/FloorThree";
import FloorFour from "../../floors/FloorFour";
import FloorFive from "../../floors/FloorFive";

// icons //
import burgerIcon from "../../images/burgerIcon.svg";
import heartIcon from "../../images/heartIcon.svg";
import homeIcon from "../../images/homeIcon.svg";

const Plan = () => {
    const [isShowAddInfo, setIsShowAddInfo] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [isActive, setIsActive] = useState(() => {
        return parseInt(localStorage.getItem("activeFloor")) || 0;
    });
    const [isShowSearch, setIsShowSearch] = useState(false);
    const [isShowCampusMenu, setIsShowCampusMenu] = useState(false);

    useEffect(() => {
        localStorage.setItem("activeFloor", isActive.toString());
    }, [isActive]);

    const countFloors = [0, 1, 2, 3, 4, 5];
    return (
        <div className="plan">
            <div className="plan__wrapper">
                <TransformWrapper>
                    <div className="scaleButton_wrapper">
                        <ScaleButton/>
                    </div>
                    <TransformComponent>
                        <Routes>
                            <Route path={`/floor/0`} element={<FloorZero/>}/>
                            <Route path={`/floor/1`} element={<FloorOne/>}/>
                            <Route path={`/floor/2`} element={<FloorTwo/>}/>
                            <Route path={`/floor/3`} element={<FloorThree/>}/>
                            <Route path={`/floor/4`} element={<FloorFour/>}/>
                            <Route path={`/floor/5`} element={<FloorFive/>}/>
                            <Route path="*" element={<Navigate to="/floor/0"/>}/>
                        </Routes>
                    </TransformComponent>
                </TransformWrapper>
            </div>
            <div className="button_wrapper button_burger">
                <div onClick={() => setIsShowMenu((prev) => !prev)}>
                    <Button icon={burgerIcon}/>
                </div>
            </div>
            <div className="boxshadow"></div>
            <div className="name__wrapper">
        <span className="text__name">
          Большая Семёновская <br/> Корпус А
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
                    <div
                        onClick={() => setIsShowAddInfo((prev) => !prev)}
                        className="button_wrapper button_heart"
                    >
                        <Button icon={heartIcon}/>
                    </div>
                    <div
                        className="searchPsevdoInput_wrapper"
                        onClick={() => setIsShowSearch((prev) => !prev)}
                    >
                        <SearchPsevdoInput/>
                    </div>
                    <div
                        className="button_wrapper button_home"
                        onClick={() => setIsShowCampusMenu((prev) => !prev)}>
                        <Button icon={homeIcon}/>
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

            <div
                className={`searchMenu_wrapper ${
                    isShowSearch ? "showSearchMenu" : "hideSearchMenu"
                }`}
            >
                <ComeBackHeader title="Поиск" backFunction={() => setIsShowSearch((prev) => !prev)}></ComeBackHeader>

                <SearchMenu
                    setIsShowSearch={setIsShowSearch}
                    isShowSearch={isShowSearch}
                />
            </div>

            <div
                className={`campusMenu_wrapper ${
                    isShowCampusMenu ? "showCampusMenu" : "hideCampusMenu"
                }`}
            >
                <ComeBackHeader title="Кампусы" backFunction={() => setIsShowCampusMenu((prev) => !prev)}></ComeBackHeader>
                <CampusMenu
                    currentLocateInfo={{campus: "на Большой Семеновской", building: "А"}}
                    setIsShowCampusMenu={setIsShowCampusMenu}
                    setIsShowSearch={setIsShowSearch}
                    setIsShowAddInfo={setIsShowAddInfo}
                    isShowAddInfo={isShowAddInfo}>
                </CampusMenu>
            </div>
        </div>
    );
};

// onTouchStart={handleTouchStartAdditionalInfo}
// onTouchMove={handleTouchMoveAdditionalInfo}
// onTouchStart={handleTouchStartMenu}
// onTouchMove={handleTouchMoveMenu}

export default Plan;
