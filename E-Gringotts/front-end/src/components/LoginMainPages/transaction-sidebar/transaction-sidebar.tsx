import React, { useState } from "react";
import "./transaction-sidebar.css";

const TransactionSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage the sidebar's open/close

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar state
  };

  return (
    <>
      <div
        className={`toggle-button ${isOpen ? "open" : ""}`}
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
    </>
  );
};

export default TransactionSidebar;
