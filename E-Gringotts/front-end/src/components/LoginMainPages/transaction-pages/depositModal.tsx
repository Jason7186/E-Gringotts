import React from "react";
import "./deposit-modal.css"; // Make sure to create this CSS file for modal styling

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  depositAmount: string;
  pin: string;
  handlePinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DepositModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  depositAmount,
  pin,
  handlePinChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="deposit-modal-overlay">
      <div className="deposit-modal-contents">
        <h2>Confirm Transaction</h2>
        <p>
          <strong>Deposit amount:</strong> {depositAmount} Galleons
        </p>
        <input
          type="password"
          value={pin}
          className="pin-input"
          onChange={handlePinChange}
          placeholder="Enter 6-digit PIN"
          maxLength={6}
        />
        <div className="deposit-button-container">
          <button className="button confirm" onClick={onConfirm}>
            Confirm
          </button>
          <button className="button cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
