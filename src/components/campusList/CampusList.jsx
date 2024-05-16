import React, { useState, useEffect } from "react";
import CampusItem from "../campusItem/CampusItem";

const CampusList = ({
  setCurrCorpus,
  campuses,
  currentLocateInfo,
  floors,
  setFloors,
  floorsImages,
  setFloorsImages,
  isActive,
  setIsActive,
  setIsShowCampusMenu,
}) => {
  const [openIndex, setOpenIndex] = useState(null);

  const { campus, building } = currentLocateInfo;

  useEffect(() => {
    const foundIndex = campuses.findIndex((item) => item.name === campus);
    setOpenIndex(foundIndex);
  }, [campus, campuses]);

  const toggleAccordion = (index) => {
    if (openIndex !== index) {
      setOpenIndex(index);
    }
  };

  const currAccordion = (itemObj, item) => {
    let currCorpusFloors = [];

    let currCorpus = itemObj.buildings.indexOf(item);

    for (let i = 0; i < itemObj.maps[currCorpus].length; i++) {
      currCorpusFloors.push(i);
    }
    setFloors(currCorpusFloors);
    setFloorsImages(itemObj.maps[currCorpus]);
    setIsActive(0);
    setIsShowCampusMenu(false);
    localStorage.setItem("activeFloor", isActive.toString());
  };

  return (
    <div className="campusList__wrapper">
      {campuses.length ? (
        <ul className="campusList">
          {campuses.map((item, index) => (
            <CampusItem
            setCurrCorpus={setCurrCorpus}
              isCurrentLocate={campus === item.name}
              selectedBuilding={building}
              name={item.name}
              notation={item.notation}
              address={item.address}
              buildings={item.buildings}
              isOpen={openIndex === index}
              toggleAccordion={() => toggleAccordion(index)}
              currAccordion={currAccordion}
              itemObj={item}
            />
          ))}
        </ul>
      ) : (
        <h3 className="campusList__message">Ничего не найдено</h3>
      )}
    </div>
  );
};

export default CampusList;
