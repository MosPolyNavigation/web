import React from 'react';
import backIcon from "../../images/backIcon.svg";

const ComeBackHeader = ({title, backFunction}) => {
    return (
        <div className="comeBackHeader__wrapper">
            <div className="comeBackHeader__content">
                <button className="comeBackHeader__button" onClick={backFunction}>
                    <img src={backIcon}
                         alt="backIcon"/>
                </button>
                <h3 className="comeBackHeader__title">{title}</h3>
            </div>
        </div>
    );
};

export default ComeBackHeader;