import React from "react";

const Button = ({ icon, text="" }) => {
  return (
    <button className="button">
        {text ? text : <img src={icon} alt={icon}/>}
    </button>
  );
};

export default Button;
