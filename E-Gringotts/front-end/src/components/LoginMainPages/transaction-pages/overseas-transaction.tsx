import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";
import React, { useState, useEffect } from "react";
import OverseasModal from "./OverseasModal";
import "./overseas-transaction.css";
import { useNavigate } from "react-router-dom";

const OverseasTransaction = () => {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("Sickle");
  const [details, setDetails] = useState("");
  const [categories, setCategories] = useState("");
  const [accountName, setAccountName] = useState("");
  const [galleonAmount, setGalleonAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isTransferSuccessful, setIsTransferSuccessful] = useState(false);
  const navigate = useNavigate;

  useEffect(() => {
    const calculateGalleons = () => {
      let rate = 0;
      if (currency === "Knut") {
        rate = 0.002028; // Conversion rate from Knuts to Galleons
      } else if (currency === "Sickle") {
        rate = 0.05882; // Conversion rate from Sickles to Galleons
      }
      setGalleonAmount((parseFloat(amount) || 0) * rate);
    };
    calculateGalleons();
  }, [amount, currency]);

  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountId(e.target.value);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const handleDetailsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails(e.target.value);
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategories(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      accountId.trim() === "" ||
      amount.trim() === "" ||
      details.trim() === "" ||
      categories.trim() === ""
    ) {
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
        <div className="overseas-transaction-container">
          <h1 style={{ color: "gold" }}>Overseas Transaction</h1>
          <h3 style={{ color: "white" }}>Available amount :</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="account-id">Transfer to:</label>
            <input
              type="text"
              id="account-id"
              value={accountId}
              onChange={handleAccountInputChange}
              placeholder="Enter Account ID"
            />
            <div className="input-group">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={handleAmountInputChange}
                placeholder="Enter Amount"
              />
              <select value={currency} onChange={handleCurrencyChange}>
                <option value="Sickle">Sickle</option>
                <option value="Knut">Knut</option>
              </select>
            </div>
            <input
              type="text"
              id="details"
              value={details}
              onChange={handleDetailsInputChange}
              placeholder="Details (Max 50 characters)"
              maxLength={50}
            />
            <select value={categories} onChange={handleCategoriesChange}>
              <option value="" disabled selected>
                Select Category
              </option>
              <option value="fund-transfer">Fund Transfer</option>
              <option value="food-and-beverage">Food and Beverage</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Housing">Housing</option>
              <option value="Medical">Medical</option>
              <option value="Social">Social</option>
              <option value="General Goods">General Goods</option>
              <option value="Magical Items">Magical Items</option>
              <option value="Others">Others</option>
            </select>
            <div className="galleon-amount">
              Amount in Galleons: {galleonAmount.toFixed(2)}
            </div>
            <button type="submit">Transfer</button>
          </form>
        </div>
      </div>
      <OverseasModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        accountId={accountId}
        amount={amount}
        currency={currency}
        galleonAmount={galleonAmount}
        details={details}
        categories={categories}
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

export default OverseasTransaction;
