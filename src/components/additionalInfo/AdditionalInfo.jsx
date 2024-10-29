import React from "react";

import SmallButton from "../smallButton/SmallButton";

//icons

import closeLargeGreyIcon from "../../images/closeLargeGreyIcon.svg";
import heartSmallIcon from "../../images/heartSmallIcon.svg";
import fromIcon from "../../images/fromIcon.svg";
import toIcon from "../../images/toIcon.svg";

const AdditionalInfo = ({ nameAudience, descAudience, setIsShowAddInfo }) => {
  return (
    <div className="additionalInfo__packet">
      <div className="additionalInfo__row">
        <div className="additionalInfo__text">
          <h2>{nameAudience}</h2>
          <span>{descAudience}</span>
        </div>
        <div
            onClick={() => setIsShowAddInfo((prev => !prev))}
          className="additionalInfo__button"
        >
          <button>
            <img src={closeLargeGreyIcon} alt="close icon" />
          </button>
        </div>
      </div>
      <div className="additionalInfo__buttons">
        <SmallButton icon={heartSmallIcon} />
        <SmallButton icon={fromIcon}>Отсюда</SmallButton>
        <SmallButton icon={toIcon}>Сюда</SmallButton>
      </div>
    </div>
  );
};

export default AdditionalInfo;
