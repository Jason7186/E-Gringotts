import React, { useState, ChangeEvent, FormEvent } from "react";
import "./edit-limit-modal.css";
import { useNavigate } from "react-router-dom";

interface EditDebitInfoModalProps {
  debitCardLimit: number;
  setDebitCardLimit: (limit: number) => void;
  setEditDebitInfo: (value: boolean) => void;
}

const EditDebitInfoModal: React.FC<EditDebitInfoModalProps> = ({
  debitCardLimit,
  setDebitCardLimit,
  setEditDebitInfo,
}) => {
  const [newDebitCardLimit, setNewDebitCardLimit] =
    useState<number>(debitCardLimit);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/user/debitCardLimit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newDebitLimit: newDebitCardLimit }),
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          console.log("Response JSON:", result);
        } else {
          const resultText = await response.text();
          console.log("Response Text:", resultText);
        }
        setDebitCardLimit(newDebitCardLimit);
        setEditDebitInfo(false);
        setIsSuccessful(true);
        setTimeout(() => {
          setIsSuccessful(false);
          navigate("/login-main");
        }, 3000);
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error: any) {
      console.log("Error in setting debit limit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEditDebitInfo(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewDebitCardLimit(parseFloat(e.target.value));
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-contents">
          <h2>Edit Debit Card Limit</h2>
          <form onSubmit={handleSubmit}>
            <label>
              New Debit Card Limit:
              <input
                type="number"
                value={newDebitCardLimit}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
          </form>
        </div>
      </div>
      {isSuccessful && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Update Successful!</h2>
            <p>Redirecting back to main page...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default EditDebitInfoModal;
