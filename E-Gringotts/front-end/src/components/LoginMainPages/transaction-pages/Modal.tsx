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
  /*accountName: string;*/
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  accountId,
  amount,
  details,
  categories,
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
          <strong>Amount:</strong> {amount} Galleons
        </p>
        <p>
          <strong>Details:</strong> {details}
        </p>
        <p>
          <strong>Category:</strong> {categories}
        </p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;