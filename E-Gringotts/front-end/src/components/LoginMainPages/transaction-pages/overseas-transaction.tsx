import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";
import React, { useState, useEffect } from "react";
import OverseasModal from "./OverseasModal";
import "./overseas-transaction.css";
import { useNavigate } from "react-router-dom";
import InstantTransactionLoadingModal from "./instant-transaction-loading-modal";

const OverseasTransaction = () => {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("Sickle");
  const [details, setDetails] = useState("");
  const [categories, setCategories] = useState("");
  const [accountName, setAccountName] = useState("");
  const [galleonAmount, setGalleonAmount] = useState(0);
  const [pin, setPin] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isTransferSuccessful, setIsTransferSuccessful] = useState(false);
  const [isFetching, setIsFetching] = useState(false); //for account name
  const [availableAmount, setAvailableAmount] = useState<number | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true); //for loading available amount
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchAvailableAmount();
  }, []);

  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountId(e.target.value);
  };

  const fetchAccountName = async (accountId: string) => {
    setIsFetching(true);
    const token = localStorage.getItem("token");
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

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPin(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      accountId.trim() === "" ||
      amount.trim() === "" ||
      details.trim() === "" ||
      categories.trim() === ""
    ) {
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
      baseCurrency: currency,
      toCurrency: "Galleon",
      securityPin: pin,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/login-transaction/oversea-transfer",
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
        <div className="overseas-transaction-container">
          <h1 style={{ color: "gold" }}>Overseas Transaction</h1>
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
        accountName={accountName}
        currency={currency}
        galleonAmount={galleonAmount}
        details={details}
        categories={categories}
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

export default OverseasTransaction;
