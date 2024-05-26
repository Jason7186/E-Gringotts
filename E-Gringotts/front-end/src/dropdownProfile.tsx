import "./style.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./components/LoginMainPages/transaction-pages/Modal.css";

interface DropDownProfileProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDownProfile: React.FC<DropDownProfileProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("isLoggedIn");
    localStorage.removeItem("item");
    navigate("/");
  };

  const getUserState = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/getUserRole", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const state = await response.json();
        const role = state.name;
        if (role == "ADMIN") {
          navigate("/login/admin-dashboard");
        } else if (role == "USER") {
          navigate("/login/user-dashboard");
        }
      } else {
        alert("Error in retrieving account details. Please try again later.");
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.log("Error in determining user state : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="dropDownProfile">
        <ul>
          <li className="loginProfile">
            <a onClick={getUserState}>Profile</a>
          </li>
          <li className="loginProfile">
            <a href="/login/card-details">Card Details</a>
          </li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>
      {isLoading && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Loading details...</h2>
            <p>Please give us a moment</p>
          </div>
        </div>
      )}
    </>
  );
};

export default DropDownProfile;
