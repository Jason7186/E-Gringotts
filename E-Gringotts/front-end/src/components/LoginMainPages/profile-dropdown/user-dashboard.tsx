import React, { useState, useEffect } from "react";
import "./dashboard.css";
import "../transaction-pages/Modal.css";

const UserDashboard = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [accountId, setAccountId] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [availableAmount, setAvailableAmount] = useState("");
  const [tier, setTier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/user/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setName(data.name);
        setAge(data.age);
        setAccountId(data.accountId);
        setDob(data.dateOfBirth);
        setEmail(data.email);
        setAvailableAmount(data.availableAmount);
        setTier(data.userTier);
      } else {
        alert("Error in fetching details. Please try again later");
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.log("Error in fetching details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="dashboard-background">
        <div className="dashboard-container">
          <h1>User Dashboard</h1>
          <div>
            <p>
              Name: <span>{name}</span>
            </p>
            <p>
              Age: <span>{age}</span>
            </p>
            <p>
              Account ID: <span>{accountId}</span>
            </p>
            <p>
              Date of Birth: <span>{dob}</span>
            </p>
            <p>
              Email: <span>{email}</span>
            </p>
            <p>
              Available Amount: <span>{availableAmount}</span>
            </p>
            <p>
              Tier: <span>{tier}</span>
            </p>
          </div>
        </div>
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

export default UserDashboard;
