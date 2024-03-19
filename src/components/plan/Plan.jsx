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
import SearchBar from "../searchBar/SearchBar";
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

const Plan = () => {
    const [isShowAddInfo, setIsShowAddInfo] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [isShowSearch, setIsShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("")
    const [audiences] = useState([
        {
            icon: studyIcon,
            nameAudience: "Н 401",
            descAudience: "Зимний сад"
        },
        {
            icon: studyIcon,
            nameAudience: "Н 402",
            descAudience: "Волонтерский центр"
        },
        {
            icon: studyIcon,
            nameAudience: "Н 405",
        },
        {
            icon: studyIcon,
            nameAudience: "Н 406",
        },
        {
            icon: legalIcon,
            nameAudience: "Н 407",
            descAudience: "Приёмная комиссия"
        },
        {
            icon: legalIcon,
            nameAudience: "Н 408",
            descAudience: "Прием заявлений приёмной комиссии"
        },
        {
            icon: legalIcon,
            nameAudience: "Н 409",
            descAudience: "Приёмная комиссия"
        },
        {
            icon: legalIcon,
            nameAudience: "Н 410",
        },
        {
            icon: manIcon,
            nameAudience: "Мужской туалет",
        },

        {
            icon: womanIcon,
            nameAudience: "Женский туалет",
        },
        {
            icon: studyIcon,
            nameAudience: "Н 411",
        },
        {
            icon: studyIcon,
            nameAudience: "Н 412",
        },
        {
            icon: foodIcon,
            nameAudience: "Столовая",
        },
        {
            icon: legalIcon,
            nameAudience: "Н 413",
            descAudience: "Приёмная комиссия"
        },
        {
            icon: booksIcon,
            nameAudience: "Библиотека",
        },
        {
            icon: wcIcon,
            nameAudience: "Общий туалет",
        },


    ])

    const formattedStr = (str) => {
        // Удаляет все пробелы, знаки табуляции, переноса строки и приводит к нижнему регистру
        return str ? str.replace(/\s/g, '').toLowerCase() : "";
    }

    const searchedAudiences = useMemo(() => {
        // Ищем совпадения в названии или описании локации
        return [...audiences].filter(audience => formattedStr(audience.nameAudience).includes(formattedStr(searchQuery.toLowerCase()))
            || formattedStr(audience.descAudience).includes(formattedStr(searchQuery.toLowerCase())))

    }, [searchQuery, audiences])

    const firstSearchMenuShow = (prev) => {
        if (isShowSearch) {
            return prev
        }
        return !prev;
    }

    const clickCloseSearch = () => {
        // Закрываем меню поиска и очищаем searchBar
        setIsShowSearch((prev) => !prev)
        setSearchQuery("");
    }


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
                    <div onClick={() => setIsShowSearch((prev) => firstSearchMenuShow(prev))}
                         className={`searchBar_wrapper ${isShowSearch ? "searchBar_big" : ""}`}>
                        <div className="SearchMenu__buttons">
                            <SearchBar
                                props={(e) => setSearchQuery(e.target.value)}
                                placeholder={isShowSearch ? "Введите запрос..." : "Поиск..."}
                                searchQuery={searchQuery}
                            />
                            <button className={`${isShowSearch ? "searchBar_close_show" : "searchBar_close_hidden"}`}
                                    onClick={clickCloseSearch}>
                                <img src={closeLargeIcon}
                                     alt="closeIcon"/>
                            </button>
                        </div>
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

            <div className={`searchMenu_wrapper ${isShowSearch ? "showSearchMenu" : "hideSearchMenu"}`}>
                <SearchMenu setIsShowSearch={setIsShowSearch} audiences={searchedAudiences}/>
            </div>
        </div>
    );
};

export default Plan;
