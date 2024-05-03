import "./style.css";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface DropDownProfileProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDownProfile: React.FC<DropDownProfileProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

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
