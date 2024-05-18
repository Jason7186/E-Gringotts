import { useState } from "react";
import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";
import "./deposit.css";
import DepositModal from "./depositModal";

const Deposit = () => {
  const [deposit, setDeposit] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isTransferSuccessful, setIsTransferSuccessful] = useState(false);

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeposit(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Corrected to invoke as a function
    if (deposit.trim() === "") {
      alert("Please enter deposit amount.");
      return;
    } else {
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

  return (
    <>
      <TransactionSidebar />
      <div className="deposit-background">
        <div className="deposit-container">
          <h1 style={{ color: "gold" }}>Deposit</h1>
          <h3 style={{ color: "white" }}>
            Balance : {"to be fetched"} Galleons
          </h3>
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
        </div>
      </div>
    </>
  );
};

export default Deposit;
