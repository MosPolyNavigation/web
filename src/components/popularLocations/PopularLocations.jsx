import React from 'react';
import SmallButton from "../smallButton/SmallButton";

// icons

import manIcon from "../../images/manIcon.svg"
import womanIcon from "../../images/womanIcon.svg"
import booksIcon from "../../images/booksIcon.svg"
import wcIcon from "../../images/wcIcon.svg"
import foodIcon from "../../images/foodIcon.svg"
import enterIcon from "../../images/enterIcon.svg"
import legalIcon from "../../images/legalIcon.svg"

const PopularLocations = () => {
    // location = [[text, icon]]
    const locations = [["", womanIcon], ["", manIcon], ["H 210", foodIcon], ["", booksIcon], ["Вход", enterIcon], ["Приёмная комиссия", legalIcon]]
    // const icons = {
    //     "wcm": manIcon,
    //     "wcw": womanIcon,
    //     "wcu": wcIcon,
    //     "food": foodIcon,
    //     "library": booksIcon,
    // }

    const getSmallButton = (item) => {
        return <SmallButton icon={item[1]}>{item[0]}</SmallButton>
    }


    return (
        <ul className="locations__list">
            {locations.map((item) => (
                <li className="location__item">
                    {getSmallButton(item)}
                </li>
            ))}
        </ul>
    );
};

export default PopularLocations;