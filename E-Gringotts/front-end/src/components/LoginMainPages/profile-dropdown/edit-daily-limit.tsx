import React, { useState, ChangeEvent, FormEvent } from "react";
import "./edit-limit-modal.css";
import { useNavigate } from "react-router-dom";

interface EditDailyLimitProps {
    DailyLimit: number;
    setDailyLimit: (limit: number) => void;
    onClose: () => void;
}

const EditDailyLimit: React.FC<EditDailyLimitProps> = ({ DailyLimit, setDailyLimit, onClose }) => {
    const [newLimit, setNewLimit] = useState(DailyLimit);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewLimit(parseInt(e.target.value));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/user/dailyLimit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ newDailyLimit: newLimit }),
            });

            if (response.ok) {
                setDailyLimit(newLimit);
                onClose();
            } else {
                console.log("Error in setting new daily limit.")
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
                        <h3>Setting Daily limit...</h3>
                        <p>Please wait a moment.</p>
                    </div>
                ) : (
                    <>
                    <h2>Edit Daily Limit</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="DailyLimit">New Daily Limit:</label>
                        <input
                            type="number"
                            id="DailyLimit"
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

export default EditDailyLimit;
