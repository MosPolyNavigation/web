import React, {useEffect, useRef} from 'react';

import Button from "../button/Button";

const CampusItem = ({name, notation, address, buildings, isOpen, toggleAccordion, isCurrentLocate, selectedBuilding}) => {
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight + 20}px` : '0px';
        }
    }, [isOpen]);

    return (
        <li className="campusItem__item">
            <div className={`accordion__item ${isOpen ? "open" : ""}`} onClick={toggleAccordion}>
                <div className="accordion__text">
                    <h3 className="campusItem__title">{name}</h3>
                </div>
                <div ref={contentRef} className="accordion__content">
                    <p className="campusItem__description">
                        Обозначение: {notation}
                        <br/>
                        Адрес: {address}
                    </p>
                    <p className="campusItem__text">Корпуса: </p>
                    <ul className="campusItem__buildings">
                        {
                            buildings.length ?
                                    buildings.map((item) => (
                                        isCurrentLocate && selectedBuilding === item ?
                                            <li className="campusItem__building campusItem__building-selected">
                                                <Button text={item}/>
                                            </li>
                                            :
                                            <li className="campusItem__building">
                                                <Button text={item}/>
                                            </li>
                                    ))
                                :
                                <p className="campusList__message">Нет корпусов</p>
                        }

                    </ul>
                </div>
            </div>
        </li>
    );
};

export default CampusItem;