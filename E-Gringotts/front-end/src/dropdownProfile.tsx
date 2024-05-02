import "./style.css";
import React from "react";

interface DropDownProfileProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDownProfile: React.FC<DropDownProfileProps> = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log("logout");
    sessionStorage.removeItem("isLoggedIn");
  };

  return (
    <div className="dropDownProfile">
      <ul>
        <li>Profile</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default DropDownProfile;
