import React, {useState, useEffect} from 'react';
import CampusItem from "../campusItem/CampusItem";

const CampusList = ({campuses, currentLocateInfo}) => {
    const [openIndex, setOpenIndex] = useState(null);

    const {campus, building} = currentLocateInfo;

    useEffect(() => {
        const foundIndex = campuses.findIndex(item => item.name === campus);
        setOpenIndex(foundIndex);
    }, [campus, campuses]);

    const toggleAccordion = index => {
        if (openIndex !== index) {
            setOpenIndex(index);
        }
    };

    return (
        <div className="campusList__wrapper">
            {
                campuses.length ?
                    <ul className="campusList">
                        {campuses.map((item, index) => (
                            <CampusItem isCurrentLocate={campus === item.name} selectedBuilding={building}
                                        name={item.name} notation={item.notation}
                                        address={item.address} buildings={item.buildings}
                                        isOpen={openIndex === index}
                                        toggleAccordion={() => toggleAccordion(index)}/>
                        ))}
                    </ul>
                    :
                    <h3 className="campusList__message">Ничего не найдено</h3>
            }
        </div>
    );
};

export default CampusList;