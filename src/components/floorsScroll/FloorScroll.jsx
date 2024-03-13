import React, { useState } from "react";

const FloorScroll = () => {
  const [isActive, setIsActive] = useState(0);
  const countFloors = [1, 2, 3, 4, 5, 6];

  const handleIsActive = (index) => {
    setIsActive(index);
  };
  return (
    <ul className="floors__list">
      {countFloors.map((number, index) => (
        <li key={index} className={`floors__item floors__item_${index}`}>
          <button
            onClick={() => handleIsActive(index)}
            className={`floors__button ${
              isActive === index ? "floor__button_active" : ""
            }`}
          >
            {number}
          </button>
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
