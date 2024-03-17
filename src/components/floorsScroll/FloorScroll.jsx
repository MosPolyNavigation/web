import React, { useState } from "react";
import { Link } from "react-router-dom";

const FloorScroll = ({ countFloors, isActive, setIsActive }) => {
  const handleIsActive = (index) => {
    setIsActive(index);
  };
  return (
    <ul className="floors__list">
      {countFloors.map((number, index) => (
        <li key={index} className={`floors__item floors__item_${index}`}>
          <Link
            to={`/floor/${number}`}
            onClick={() => handleIsActive(index)}
            className={`floors__button ${
              isActive === index ? "floor__button_active" : ""
            }`}
          >
            {number}
          </Link>

          {index === 0 ? (
            <span
              className="floors__item_active"
              style={{ top: isActive === 0 ? "0%" : `${isActive * 100}%` }}
            ></span>
          ) : (
            ""
          )}
        </li>
      ))}
    </ul>
  );
};

export default FloorScroll;
