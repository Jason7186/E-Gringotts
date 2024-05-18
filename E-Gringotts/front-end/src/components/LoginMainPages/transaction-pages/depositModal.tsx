import React from "react";
import "./Modal.css"; // Make sure to create this CSS file for modal styling

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  depositAmount: string;
}

const DepositModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  depositAmount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contents">
        <h2>Confirm Transaction</h2>
        {/*<p><strong>Account Name:</strong> {accountName}</p>*/}
        <p>
          <strong>Deposit amount:</strong> {depositAmount} Galleons
        </p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DepositModal;
