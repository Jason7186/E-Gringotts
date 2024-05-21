import React from "react";
import "./Modal.css"; // Make sure to create this CSS file for modal styling

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountId: string;
  amount: string;
  details: string;
  categories: string;
  accountName: string;
  pin: string;
  handlePinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  accountId,
  amount,
  details,
  categories,
  accountName,
  pin,
  handlePinChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contents">
        <h2>Confirm Transaction</h2>
        <p>
          <strong>Account ID:</strong> {accountId}
        </p>
        <p>
          <strong>Account Name:</strong> {accountName}
        </p>
        <p>
          <strong>Amount:</strong> {amount} Galleons
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

export default Modal;
