import React, {useState} from 'react';

import CampusList from "../campusList/CampusList";
import Button from "../button/Button";
import SearchPsevdoInput from "../searchPsevdoInput/SearchPsevdoInput";
import AdditionalInfo from "../additionalInfo/AdditionalInfo";

//icons
import heartIcon from "../../images/heartIcon.svg";
import closeLargeIcon from "../../images/closeLargeIcon.svg";


const CampusMenu = ({currentLocateInfo, setIsShowCampusMenu, setIsShowAddInfo, setIsShowSearch, isShowAddInfo}) => {

    const [campuses] = useState([
        {
            name: "на Большой Семеновской",
            notation: "БС",
            address: "ул. Большая Семеновская, д. 38",
            buildings: ["А", "Б", "В", "Н", "НД"]
        },
        {
            name: "на Автозаводской",
            notation: "Ав",
            address: "ул. Автозаводская, д. 16",
            buildings: ["1", "2", "3", "4", "5"]
        },
        {
            name: "на Павла Корчагина",
            notation: "Пк",
            address: "ул. Павла Корчагина, д. 22",
            buildings: ["1", "2", "3", "4", "5"]
        },
        {
            name: "на Прянишникова",
            notation: "Пр",
            address: "ул. Прянишникова, д. 2А",
            buildings: ["1", "2", "3"]
        },
        {
            name: "на Михалковской",
            notation: "М",
            address: "ул. Михалковская, 7",
            buildings: ["1", "2"]
        }

    ])

    return (
        <div className="CampusMenu__content">
            <div className="CampusMenu__block">
                <CampusList campuses={campuses} currentLocateInfo={currentLocateInfo} ></CampusList>
            </div>

            <div className="CampusMenu__buttons">
                <div
                    onClick={() => setIsShowAddInfo((prev) => !prev)}
                    className="CampusMenu__button"
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
                    className="CampusMenu__button"
                    onClick={() => setIsShowCampusMenu((prev) => !prev)}>
                    <Button icon={closeLargeIcon}/>
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
    );
};

export default CampusMenu;