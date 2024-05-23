import React from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./edit-limit-modal.css";

interface EditCreditInfoModalProps {
  creditCardLimit: number;
  setCreditCardLimit: (limit: number) => void;
  setEditCreditInfo: (value: boolean) => void;
}

const EditCreditInfoModal: React.FC<EditCreditInfoModalProps> = ({
  creditCardLimit,
  setCreditCardLimit,
  setEditCreditInfo,
}) => {
  const [newCreditCardLimit, setNewCreditCardLimit] =
    useState<number>(creditCardLimit);
  const [loading, setLoading] = useState<boolean>(false); //setting credit limit
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false); //after successfully set credit limit
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/user/creditCardLimit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newCreditLimit: newCreditCardLimit }),
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
        setCreditCardLimit(newCreditCardLimit);
        setEditCreditInfo(false);
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
      console.log("Error in setting credit limit: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEditCreditInfo(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCreditCardLimit(parseFloat(e.target.value));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contents">
        {isSuccessful ? (
          <>
            <h2>Update Successful!</h2>
            <p>Redirecting back to main page...</p>
          </>
        ) : (
          <>
            <h2>Edit Credit Card Limit</h2>
            <form onSubmit={handleSubmit}>
              <label>
                New Credit Card Limit:
                <input
                  type="number"
                  value={newCreditCardLimit}
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
          </>
        )}
      </div>
    </div>
  );
};

export default EditCreditInfoModal;
