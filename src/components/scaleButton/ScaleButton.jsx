import React from "react";
import { useControls } from "react-zoom-pan-pinch";

import minusIcon from "../../images/minusIcon.svg";
import plusIcon from "../../images/plusIcon.svg";

const ScaleButton = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="scaleButton_packet">
      <button onClick={() => zoomIn()} className="scaleButton_button">
        <img src={plusIcon} alt="plus" />
      </button>
      <button onClick={() => zoomOut()} className="scaleButton_button">
        <img src={minusIcon} alt="minus" />
      </button>
    </div>
    // <div className="temp">
    //   <button onClick={() => zoomIn()}>Zoom In</button>
    //   <button onClick={() => zoomOut()}>Zoom Out</button>
    //   <button onClick={() => resetTransform()}>Reset</button>
    // </div>
  );
};

export default ScaleButton;
