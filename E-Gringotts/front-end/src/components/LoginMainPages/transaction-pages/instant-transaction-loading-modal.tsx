import React from "react";
import "./modal.css";

interface InstantTransactionLoadingModalProps {
  isOpen: boolean;
}

const InstantTransactionLoadingModal: React.FC<
  InstantTransactionLoadingModalProps
> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contents">
        <h2>Loading...</h2>
        <p>Please wait while we fetch the account details.</p>
      </div>
    </div>
  );
};

export default InstantTransactionLoadingModal;
