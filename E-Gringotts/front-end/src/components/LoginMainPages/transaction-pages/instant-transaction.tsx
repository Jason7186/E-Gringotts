import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";
import "./instant-transaction.css";
import { useNavigate } from "react-router-dom";

const InstantTransaction = () => {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isTransferSuccessful, setIsTransferSuccessful] = useState(false);
  const navigate = useNavigate;

  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountId(e.target.value);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (accountId.trim() === "" || amount.trim() === "") {
      alert("Please enter all fields.");
      return;
    } else {
      // Assuming you fetch the account name here or it's done earlier
      {
        /*fetchAccountName(accountId);*/
      }
      setIsConfirmOpen(true);
    }
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    setIsTransferring(true); // Start the transferring process
    setTimeout(() => {
      setIsTransferring(false);
      setIsTransferSuccessful(true); // Assume transfer is successful after a delay
      setTimeout(() => setIsTransferSuccessful(false), 3000); // Close success message after 3 seconds
    }, 3000); // Simulating a transfer delay
  };

  {
    /*const fetchAccountName = async (accountId: string) => {
    try {
      const response = await fetch(`your_backend_endpoint/${accountId}`); // Adjust URL accordingly
      const data = await response.json();
      setAccountName(data.accountName); // Adjust according to your actual data structure
    } catch (error) {
      console.error("Failed to fetch account name", error);
    }
  }; */
  }

  return (
    <>
      <TransactionSidebar />
      <div className="login-transaction-background">
        <div className="transaction-container">
          <h2 style={{ color: "white" }}>Available amount :</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="account-id">Transfer to:</label>
            <input
              type="text"
              id="account-id"
              value={accountId}
              onChange={handleAccountInputChange}
              placeholder="Enter Account ID"
            />
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountInputChange}
              placeholder="Enter Amount"
            />
            <button type="submit">Transfer</button>
          </form>
        </div>
      </div>
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        accountId={accountId}
        amount={amount}
      />
      {isTransferring && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Transferring...</h2>
          </div>
        </div>
      )}
      {isTransferSuccessful && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Transfer Successful!</h2>
          </div>
        </div>
      )}
    </>
  );
};

export default InstantTransaction;
