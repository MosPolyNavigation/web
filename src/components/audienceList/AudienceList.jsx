import React, {useState} from 'react';
import AudienceItem from "../audienceItem/AudienceItem";

// icons
import studyIcon from "../../images/studyIcon.svg";
import legalIcon from "../../images/legalIcon.svg";


const AudienceList = ({audiences}) => {
    return (
        <div className="audienceList__wrapper">
            {
                audiences.length ?
                    <ul className="audienceList">
                        {audiences.map((item) => (
                            <AudienceItem key={item.nameAudience} icon={item.icon} nameAudience={item.nameAudience}
                                          descAudience={item.descAudience}/>
                        ))}
                    </ul>
                    :
                    <h3 className="audienceList__message">Ничего не найдено</h3>
            }
        </div>
    );
};

export default AudienceList;
