import React from "react";
import "./Modal.css"; // Make sure to create this CSS file for modal styling

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountId: string;
  amount: string;
  accountName: string;
  currency: string;
  galleonAmount: number;
  details: string;
  categories: string;
  pin: string;
  handlePinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OverseasModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  accountId,
  amount,
  accountName,
  currency,
  galleonAmount,
  details,
  categories,
  pin,
  handlePinChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contents">
        <h2>Confirm Transaction</h2>
        {/*<p><strong>Account Name:</strong> {accountName}</p>*/}
        <p>
          <strong>Account ID:</strong> {accountId}
        </p>
        <p>
          <strong>Account Name:</strong> {accountName}
        </p>
        <p>
          <strong>Amount in {currency}:</strong> {amount} {currency}
        </p>
        <p>
          <strong>Amount in Galleons:</strong> {galleonAmount.toFixed(2)}{" "}
          Galleons
        </p>
        <p>
          <strong>Details:</strong> {details}
        </p>
        <p>
          <strong>Category:</strong> {categories}
        </p>
        <input
          type="password"
          value={pin}
          className="pin-input"
          onChange={handlePinChange}
          placeholder="Enter 6-digit PIN"
          maxLength={6}
        />
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default OverseasModal;
