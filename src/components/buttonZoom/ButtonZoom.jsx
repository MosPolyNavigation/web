import React from "react";

import plusIcon from "./plusIcon.svg";
import minusIcon from "./minusIcon.svg";

export const ButtonZoom = () => {
  return (
    <>
      <div className="buttons__zoom_wrapper">
        <div>
          <button className="buttons__zoom_button">
            <img src={plusIcon} alt="plus icon" />
          </button>
        </div>
        <div>
          <button className="buttons__zoom_button">
            <img src={minusIcon} alt="minus icon" />
          </button>
        </div>
      </div>
    </>
  );
};
