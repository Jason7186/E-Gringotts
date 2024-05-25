import React, { useState, ChangeEvent, FormEvent } from "react";
import "./edit-limit-modal.css";
import { useNavigate } from "react-router-dom";

interface EditTransactionLimitProps {
    transactionLimit: number;
    setTransactionLimit: (limit: number) => void;
    onClose: () => void;
}

const EditTransactionLimit: React.FC<EditTransactionLimitProps> = ({ transactionLimit, setTransactionLimit, onClose }) => {
    const [newLimit, setNewLimit] = useState(transactionLimit);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewLimit(parseInt(e.target.value));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/user/maxTransferLimit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ newMaxTransferLimit: newLimit }),
            });

            if (response.ok) {
                setTransactionLimit(newLimit);
                onClose();
            } else {
                console.log("Error in setting new transaction limit.")
            }
        } catch (error) {
            console.log("Error : ", error)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <div className="modal-overlay">
            <div className="modal-contents">
                {isSubmitting ? (
                    <div>
                        <h3>Setting transaction limit...</h3>
                        <p>Please wait a moment.</p>
                    </div>
                ) : (
                    <>
                    <h2>Edit Transaction Limit</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="transactionLimit">New Transaction Limit:</label>
                        <input
                            type="number"
                            id="transactionLimit"
                            value={newLimit}
                            onChange={handleInputChange}
                            required
                        />
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </form>
                    </>
                )}
            </div>
        </div>
        </>
    );
};

export default EditTransactionLimit;
