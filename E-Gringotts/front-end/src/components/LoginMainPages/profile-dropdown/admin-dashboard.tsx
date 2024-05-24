import React from "react";
import { useState, useEffect } from "react";
import "./admin-dashboard.css";
import "../transaction-pages/Modal.css";
import PieChart from "./PieChart";

const AdminDashboard = () => {
  type UserTierDataType = [number, number, number];
  type TransactionDataType = [number, number, number];

  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [accountId, setAccountId] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [availableAmount, setAvailableAmount] = useState("");
  const [tier, setTier] = useState("");
  const [totalUser, setTotalUser] = useState();
  const [transactionPerDay, setTransactionPerDay] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [userTierData, setUserTierData] = useState<UserTierDataType>([0, 0, 0]);
  const userTierLabel = ["Silver Snitch", "Golden Galleon", "Platinum Patronus"];
  const [TransactionData, setTransactionData] = useState<TransactionDataType>([0, 0, 0]);
  const TransactionLabel = ["Deposit", "Instant Transfer", "Oversea Transfer"];

  useEffect(() => {
    getAdminDetails();
  }, []);

  const getAdminDetails = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/admin/dashboard", {
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
        setTotalUser(data.userTotalNum);
        setTransactionPerDay(data.transactionsTotalPerDay);
        setUserTierData([data.silverCount, data.goldCount, data.platinumCount]);
        setTransactionData([data.depositPerDay, data.instantTransferPerDay, data.overseaTransferPerDay]);
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
      <div className="admin-dashboard-background">
        <div className="admin-dashboard-container">
          <h1>Admin Dashboard</h1>
          <div>
            <p>
              Name : <span>{name}</span>
            </p>
            <p>
              Age : <span>{age}</span>
            </p>
            <p>
              Account ID : <span>{accountId}</span>
            </p>
            <p>
              Date of Birth : <span>{dob}</span>
            </p>
            <p>
              Email : <span>{email}</span>
            </p>
            <p>
              Available Amount : <span>{availableAmount}</span>
            </p>
            <p>
              Tier : <span>{tier}</span>
            </p>
            <p>
              Total Users : <span>{totalUser}</span>
            </p>
            <p>
              Transactions Today: <span>{transactionPerDay}</span>
            </p>
          </div>
        </div>
        <div className="chart-container">
          <div className="user-tier-chart-container">
            <h3>User Tiers</h3>
            <PieChart data={userTierData} labels={userTierLabel}/>
          </div>
          <div className="user-tier-chart-container">
            <h3>Transactions Today</h3>
            <PieChart data={TransactionData} labels={TransactionLabel}/>
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

export default AdminDashboard;
