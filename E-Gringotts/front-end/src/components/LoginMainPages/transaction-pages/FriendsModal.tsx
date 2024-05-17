import React from "react";
import "./Modal.css"; // Make sure to create this CSS file for modal styling

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountId: string;
  accountName: string;
}

const FriendsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  accountId,
  accountName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contents">
        <h2>Confirm Adding Friend?</h2>
        <p>
          <strong>Account Name:</strong> {accountName}
        </p>
        <p>
          <strong>Account ID:</strong> {accountId}
        </p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default FriendsModal;
