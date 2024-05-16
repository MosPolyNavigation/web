import React, { useEffect, useRef, useState } from "react";

import Button from "../button/Button";

const CampusItem = ({
  setCurrCorpus,
  name,
  notation,
  address,
  buildings,
  isOpen,
  toggleAccordion,
  isCurrentLocate,
  selectedBuilding,
  currAccordion,
  itemObj,
}) => {
  const contentRef = useRef(null);

  const [activeCampus, setActiveCampus] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen
        ? `${contentRef.current.scrollHeight + 20}px`
        : "0px";
    }
  }, [isOpen]);

  const activeBuilding = (itemContent) => {
    const item = buildings.filter((building) => building === itemContent)[0];
    setActiveCampus(item);
    setCurrCorpus(item);
  };

  return (
    <li className="campusItem__item">
      <div
        className={`accordion__item ${isOpen ? "open" : ""}`}
        onClick={() => {
          toggleAccordion();
        }}
      >
        <div className="accordion__text">
          <h3 className="campusItem__title">{name}</h3>
        </div>
        <div ref={contentRef} className="accordion__content">
          <p className="campusItem__description">
            Обозначение: {notation}
            <br />
            Адрес: {address}
          </p>
          <p className="campusItem__text">Корпуса: </p>
          <ul className="campusItem__buildings">
            {buildings.length ? (
              buildings.map((item) =>
                isCurrentLocate && selectedBuilding === item ? (
                  <li
                    key={item}
                    onClick={() => {
                      currAccordion(itemObj, item);
                      activeBuilding(item);
                    }}
                    className={`campusItem__building ${
                      activeCampus === item
                        ? "campusItem__building-selected"
                        : ""
                    }`}
                  >
                    <Button text={item} />
                  </li>
                ) : (
                  <li
                    key={item}
                    onClick={() => {
                      currAccordion(itemObj, item);
                      activeBuilding(item);
                    }}
                    className={`campusItem__building ${
                      activeCampus === item
                        ? "campusItem__building-selected"
                        : ""
                    }`}
                  >
                    <Button onClick={() => activeBuilding(item)} text={item} />
                  </li>
                )
              )
            ) : (
              <p className="campusList__message">Нет корпусов</p>
            )}
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CampusItem;
