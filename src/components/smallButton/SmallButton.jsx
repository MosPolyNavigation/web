import React from "react";

export const SmallButton = ({ icon, iconClass }) => {
  return (
    <>
      <button
        className={`button button_small ${
          iconClass !== "" ? `button_small_${iconClass}` : ""
        }`}
      >
        {icon}
      </button>
    </>
  );
};
