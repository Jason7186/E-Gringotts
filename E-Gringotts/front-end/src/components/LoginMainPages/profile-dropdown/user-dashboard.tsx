import React, { useState, useEffect } from "react";
import "./dashboard.css";
import "../transaction-pages/Modal.css";
import edit from "./edit.png";
import EditTransactionLimit from "./edit-transaction-limit";
import EditDailyLimit from "./edit-daily-limit";

const UserDashboard = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [accountId, setAccountId] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [availableAmount, setAvailableAmount] = useState("");
  const [tier, setTier] = useState("");
  const [dailyLimit, setDailyLimit] = useState<number>(0);
  const [transferLimit, setTransferLimit] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editTransaction, setEditTransaction] = useState(false) //edit transaction limit
  const [editDaily, setEditDaily] = useState(false) //edit dailiy limit

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
        setDailyLimit(data.limitPerDay)
        setTransferLimit(data.limitPerTransactions)
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

  const editTransactionLimit = () => {
    setEditTransaction(true)
  }

  const editDailyLimit = () => {
    setEditDaily(true);
  }

  const closeEditTransactionLimit = () => {
    setEditTransaction(false);
  };

  const closeEditDailyLimit = () => {
    setEditDaily(false);
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
            <p>
              Transaction Limit: <span>{transferLimit}</span>
              <img
                  className="edit"
                  src={edit}
                  alt="edit"
                  onClick={editTransactionLimit}
                ></img>
            </p>
            <p>
              Daily Transaction Limit: <span>{dailyLimit}</span>
              <img
                  className="edit"
                  src={edit}
                  alt="edit"
                  onClick={editDailyLimit}
                ></img>
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
      {editTransaction && (
        <EditTransactionLimit
          transactionLimit={transferLimit}
          setTransactionLimit={setTransferLimit}
          onClose={closeEditTransactionLimit}
        />
      )}
      {editDaily && (
        <EditDailyLimit
          DailyLimit={dailyLimit}
          setDailyLimit={setDailyLimit}
          onClose={closeEditDailyLimit}
        />
      )}
    </>
  );
};

export default UserDashboard;
