import React from 'react';

const AudienceItem = ({icon, nameAudience, descAudience}) => {
    return (
        <li className="audienceItem__item">
            <img src={icon} alt="Аудитория" className="audienceItem__icon"/>
            <div className="audienceItem__text">
                <h3 className="audienceItem__name">{nameAudience}</h3>
                {/*Если descAudience не undefined и не пустая строка*/}
                {descAudience &&
                    <span className="audienceItem__desc">{descAudience}</span>
                }
            </div>
        </li>
    );
};

export default AudienceItem;