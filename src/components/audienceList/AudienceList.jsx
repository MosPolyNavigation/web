import React from 'react';
import AudienceItem from "../audienceItem/AudienceItem";

// icons
import studyIcon from "../../images/studyIcon.svg";
import legalIcon from "../../images/legalIcon.svg";


const AudienceList = () => {
    const audiences = [
        {
            icon: studyIcon,
            nameAudience: "Н 402",
            descAudience: "Волонтерский центр"
        },
        {
            icon: studyIcon,
            nameAudience: "Н 405",
        },
        {
            icon: studyIcon,
            nameAudience: "Н 406",
        },
        {
            icon: legalIcon,
            nameAudience: "Н 408",
            descAudience: "Прием заявлений приёмной комиссии"
        },
    ]

    return (
        <ul className="audienceList">
            {audiences.map((item) => (
                <AudienceItem icon={item.icon} nameAudience={item.nameAudience} descAudience={item.descAudience}/>
            ))}
        </ul>
    );
};

export default AudienceList;