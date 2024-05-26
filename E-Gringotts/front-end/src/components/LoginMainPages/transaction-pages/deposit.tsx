import { useState, useEffect } from "react";
import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";
import "./deposit.css";
import DepositModal from "./depositModal";
import { useNavigate, useParams } from "react-router-dom";

const Deposit = () => {
  const [deposit, setDeposit] = useState("");
  const [availableAmount, setAvailableAmount] = useState<number | undefined>(
    undefined
  );
  const [pin, setPin] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false); //after confirm modal
  const [isTransferSuccessful, setIsTransferSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(true); //for loading available amount
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableAmount();
  }, []);

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeposit(e.target.value);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (deposit.trim() === "") {
      alert("Please enter deposit amount.");
      return;
    } else {
      setIsConfirmOpen(true);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPin(value);
    }
  };

  //confirm and deposit
  const handleConfirm = async () => {
    if (pin.length !== 6) {
      alert("Please enter a valid 6-digit PIN.");
      return;
    }

    setIsConfirmOpen(false);
    setIsTransferring(true);

    const token = localStorage.getItem("token");
    const depositDetails = {
      amount: deposit,
      securityPin: pin,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/login-transaction/deposit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(depositDetails),
        }
      );
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
      <div className="deposit-background">
        <div className="deposit-container">
          <h1 style={{ color: "gold" }}>Deposit</h1>
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
            <label htmlFor="deposit-amount">Enter deposit amount</label>
            <input
              type="number"
              id="deposit-amount"
              value={deposit}
              onChange={handleDepositChange}
              placeholder="Enter deposit amount"
            ></input>
            <button type="submit">Transfer</button>
          </form>
          <DepositModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirm}
            depositAmount={deposit}
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
        </div>
      </div>
    </>
  );
};

export default Deposit;
