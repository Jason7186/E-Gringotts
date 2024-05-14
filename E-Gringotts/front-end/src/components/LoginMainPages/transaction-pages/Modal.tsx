import React from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountId: string;
  amount: string;
  accountName: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  accountId,
  amount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Transaction</h2>
        {/*<p><strong>Account Name:</strong> {accountName}</p> */}
        <p>
          <strong>Account ID:</strong> {accountId}
        </p>
        <p>
          <strong>Amount:</strong> {amount} Galleons
        </p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
