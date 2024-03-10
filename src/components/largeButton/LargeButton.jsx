import React from "react";

export const LargeButton = ({ icon, iconClass = '' }) => {
  return (
    <button
      className={`button button_large ${
        iconClass !== '' ? `button_large_${iconClass}` : ""
      }`}
    >
      {icon}
    </button>
  );
};


