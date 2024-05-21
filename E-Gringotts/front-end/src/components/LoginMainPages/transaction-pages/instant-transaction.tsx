import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";
import "./instant-transaction.css";
import { useNavigate, useParams } from "react-router-dom";
import InstantTransactionLoadingModal from "./instant-transaction-loading-modal";

const InstantTransaction = () => {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [categories, setCategories] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false); // after confirm transferring modal
  const [isTransferSuccessful, setIsTransferSuccessful] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // for account name
  const [availableAmount, setAvailableAmount] = useState<number | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true); // for loading available amount
  const [pin, setPin] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setAccountId(id); // Set the accountId if passed via URL
    }
    fetchAvailableAmount();
  }, [id]);

  const fetchAccountName = async (accountId: string) => {
    const token = localStorage.getItem("token");
    setIsFetching(true);
    try {
      const response = await fetch(
        `http://localhost:8080/login-transaction/searchId/${accountId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch account details");
      const data = await response.json();
      console.log("API Response:", data);
      setAccountName(data.userName);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Fetching account name failed:", error);
      alert("User not found. Please enter a valid account ID");
      return;
    } finally {
      setIsFetching(false); // Hide loading modal
    }
  };

  const fetchAvailableAmount = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/login-transaction/check-balance",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch account details");
      const data = await response.json();
      console.log("API Response:", data);
      setAvailableAmount(data);
    } catch (error) {
      console.error("Error fetching available amount:", error);
      setAvailableAmount(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountId(e.target.value);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleDetailsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails(e.target.value);
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategories(e.target.value);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPin(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accountId || !amount || !details || !categories) {
      alert("Please enter all fields.");
      return;
    }

    if (!accountName) {
      await fetchAccountName(accountId);
    }

    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (pin.length !== 6) {
      alert("Please enter a valid 6-digit PIN.");
      return;
    }

    setIsModalOpen(false);
    setIsTransferring(true);

    const token = localStorage.getItem("token");
    console.log({ token });
    const transactionInfo = {
      receiverAccountId: accountId,
      amount: parseFloat(amount),
      category: categories,
      transactionDetails: details,
      securityPin: pin,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/login-transaction/instant-transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transactionInfo),
        }
      );
      console.log("Sending transaction info:", JSON.stringify(transactionInfo));
      if (response.ok) {
        setIsTransferSuccessful(true);
        setTimeout(() => setIsTransferSuccessful(false), 3000);
        setTimeout(() => {
          navigate("/login-main");
        }, 3000);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      alert("Transaction failed. Please try again later.");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <>
      <TransactionSidebar />
      <div className="login-transaction-background">
        <div className="transaction-container">
          <h1 style={{ color: "gold" }}>Instant Transaction</h1>
          {isLoading ? (
            <h3 style={{ color: "white" }}>Loading available amount...</h3>
          ) : (
            <h3 style={{ color: "white" }}>
              Available amount:{" "}
              {availableAmount !== undefined
                ? `${availableAmount.toFixed(2)} Galleons`
                : "No data available"}
            </h3>
          )}
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
            <input
              type="text"
              id="details"
              value={details}
              onChange={handleDetailsInputChange}
              placeholder="Details (Max 50 charcaters)"
              maxLength={50}
            />
            <select value={categories} onChange={handleCategoriesChange}>
              <option value="" disabled selected>
                Select Category
              </option>
              <option value="Fund Transfer">Fund Transfer</option>
              <option value="Food and Beverage">Food and Beverage</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Housing">Housing</option>
              <option value="Medical">Medical</option>
              <option value="Social">Social</option>
              <option value="General Goods">General Goods</option>
              <option value="Magical Items">Magical Items</option>
              <option value="Others">Others</option>
            </select>
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
        details={details}
        categories={categories}
        accountName={accountName}
        pin={pin}
        handlePinChange={handlePinChange}
      />
      {isTransferring && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Transferring...</h2>
            <p>Please give us a moment...</p>
          </div>
        </div>
      )}
      {isTransferSuccessful && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Transfer Successful!</h2>
            <p>Redirecting back to main page...</p>
          </div>
        </div>
      )}
      <InstantTransactionLoadingModal isOpen={isFetching} />
    </>
  );
};

export default InstantTransaction;
