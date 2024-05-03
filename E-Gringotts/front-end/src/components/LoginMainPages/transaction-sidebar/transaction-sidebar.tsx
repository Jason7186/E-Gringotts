import React, { useState } from "react";
import "./transaction-sidebar.css";

const TransactionSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage the sidebar's open/close

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar state
  };

  return (
    <>
      <div className="background-transaction">
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
            <button className="button">Friends</button>
            <button className="button">Overseas Transaction</button>
            <button className="button">Instant Transaction</button>
            <button className="button">Deposit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionSidebar;
