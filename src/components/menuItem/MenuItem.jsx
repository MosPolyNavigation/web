import React from "react";

const MenuItem = ({ icon, children }) => {
  return (
    <li className="menuItem">
      <button>
        <img src={icon} alt="icon" />
        <span>{children}</span>
      </button>
    </li>
  );
};

export default MenuItem;
