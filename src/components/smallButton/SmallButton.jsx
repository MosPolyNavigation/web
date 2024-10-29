import React from "react";

const SmallButton = ({icon, iconColor, children}) => {
    return (
        <button className={children ? "button_small_row button_small" : "button_small"}>
            {/* Если иконка отсутствует то тег img не создается */}
            {icon ? console.log("yes") : console.log("no")}
            {icon ? <img src={icon} alt="icon" /> : ""}
            {children}
        </button>
    );
};

export default SmallButton;
