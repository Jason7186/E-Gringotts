import React, { useState } from "react";
import "./transaction-sidebar.css";

const TransactionSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage the sidebar's open/close

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar state
  };

  return (
    <>
      <div>
        <h1 className="transaction-text">
          All you transactions in an instant. No magic, only E-Gringotts.
        </h1>
      </div>
      <div
        className={`toggle-button ${isOpen ? "  open" : ""}`}
        onClick={toggleSidebar}
      >
        {isOpen ? "×" : "≡"}
      </div>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="button-container">
          <button className="button">
            <a href="/login-transaction/friends">Friends</a>
          </button>
          <button className="button">
            <a href="/login-transaction/overseas-transaction">
              Overseas Transaction
            </a>
          </button>
          <button className="button">
            <a href="/login-transaction/instant-transaction">
              Instant Transaction
            </a>
          </button>
          <button className="button">
            <a href="/login-transaction/deposit">Deposit</a>
          </button>
          <button className="button">
            <a href="/login-transaction/transaction-history">
              Transaction History
            </a>
          </button>
        </div>
      </div>
    </>
  );
};

export default TransactionSidebar;
