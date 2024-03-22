import React, {useMemo, useState} from "react";

import SmallButton from "../smallButton/SmallButton";

// icons

import manIcon from "../../images/manIcon.svg";
import womanIcon from "../../images/womanIcon.svg";
import legalIcon from "../../images/legalIcon.svg";
import studyIcon from "../../images/studyIcon.svg";
import AudienceList from "../audienceList/AudienceList";
import PopularLocations from "../popularLocations/PopularLocations";
import SearchBar from "../searchBar/SearchBar";
import closeLargeIcon from "../../images/closeLargeIcon.svg";
import foodIcon from "../../images/foodIcon.svg";
import booksIcon from "../../images/booksIcon.svg";
import wcIcon from "../../images/wcIcon.svg";


const SearchMenu = ({setIsShowSearch, isShowSearch}) => {
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
        {
            icon: studyIcon,
            nameAudience: "Н 414",
            descAudience: "Летний сад"
        },
        {
            icon: studyIcon,
            nameAudience: "Н 415",
            descAudience: "Волонтерский центр"
        },
        {
            icon: studyIcon,
            nameAudience: "Н 416",
        },

    ])

    const formattedStr = (str) => {
        // Удаляет все пробелы, знаки табуляции, переноса строки, приводит к нижнему регистру, заменяет ё на е
        // const latinInCyrillic = {"h": "н", "b": "в", "pr": "пp", "ab": "ав", "a": "а"}
        return str ? str.replace(/\s/g, '').replace("ё", "е").toLowerCase() : "";
    }

    const searchedAudiences = useMemo(() => {
        // Ищем совпадения в названии или описании локации
        return [...audiences].filter(audience => formattedStr(audience.nameAudience).includes(formattedStr(searchQuery.toLowerCase()))
            || formattedStr(audience.descAudience).includes(formattedStr(searchQuery.toLowerCase())))

    }, [searchQuery, audiences])

    const clickCloseSearch = () => {
        // Закрываем меню поиска и очищаем searchBar
        setIsShowSearch((prev) => !prev)
        setSearchQuery("");
    }


    return (
        <div className="SearchMenu__content">

            <div className="SearchMenu__block">
                <AudienceList audiences={searchedAudiences}/>
                <PopularLocations/>
            </div>

            <div className="SearchMenu__buttons">
                <div className="searchBar_wrapper searchBar_big">
                    <SearchBar
                        data={(e) => setSearchQuery(e.target.value)}
                        isShowSearch={isShowSearch}
                        placeholder="Введите запрос..."
                        searchQuery={searchQuery}
                    />
                </div>
                <button className={`${isShowSearch ? "searchBar_close_show" : "searchBar_close_hidden"}`}
                        onClick={clickCloseSearch}>
                    <img src={closeLargeIcon}
                         alt="closeIcon"/>
                </button>
            </div>
        </div>
    );
};

export default SearchMenu;