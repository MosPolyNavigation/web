import React from "react";

import SmallButton from "../smallButton/SmallButton";

// icons

import manIcon from "../../images/manIcon.svg";
import womanIcon from "../../images/womanIcon.svg";
import legalIcon from "../../images/legalIcon.svg";
import studyIcon from "../../images/studyIcon.svg";
import AudienceList from "../audienceList/AudienceList";
import PopularLocations from "../popularLocations/PopularLocations";
import SearchBar from "../searchBar/SearchBar";
import closeLargeIcon from "../../images/closeLargeIcon.svg";


const SearchMenu = ({setIsShowSearch, audiences}) => {
    return (
        <div className="SearchMenu__content">
            <AudienceList audiences={audiences}/>

            <PopularLocations/>
        </div>
    );
};

export default SearchMenu;