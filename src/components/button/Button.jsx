import React from "react";

const Button = ({ icon }) => {
  return (
    <button className="button">
      <img src={icon} alt={icon} />
    </button>
  );
};

export default Button;
