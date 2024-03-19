import React from 'react';
import SmallButton from "../smallButton/SmallButton";

// icons

import manIcon from "../../images/manIcon.svg"
import womanIcon from "../../images/womanIcon.svg"
import booksIcon from "../../images/booksIcon.svg"
import wcIcon from "../../images/wcIcon.svg"
import foodIcon from "../../images/foodIcon.svg"

const PopularLocations = () => {
    const locations = ["wcw", "wcm", "H 210", "library", "Вход", "Приёмная комиссия"]
    const icons = {
        "wcm": manIcon,
        "wcw": womanIcon,
        "wcu": wcIcon,
        "food": foodIcon,
        "library": booksIcon,
    }

    const getSmallButton = (item) => {
        if (item in icons) {
            return <SmallButton icon={icons[item]} />
        }
        return <SmallButton>{item}</SmallButton>
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