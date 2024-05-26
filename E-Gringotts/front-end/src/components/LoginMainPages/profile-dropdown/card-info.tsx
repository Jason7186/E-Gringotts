import { useState, useEffect } from "react";
import "./card-info.css";
import debitCard from "./debit-card.png";
import creditCard from "./credit-card.png";
import edit from "./edit.png";
import "../transaction-pages/Modal.css";
import EditDebitInfoModal from "./edit-debit-info";
import EditCreditInfoModal from "./edit-credit-info";

const CardDetails = () => {
  const [debitCardNumber, setDebitCardNumber] = useState("");
  const [debitCardExpireDate, setDebitCardExpireDate] = useState("");
  const [debitCardCVV, setDebitCardCVV] = useState("");
  const [debitCardLimit, setDebitCardLimit] = useState(0.0);
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [creditCardExpireDate, setCreditCardExpireDate] = useState("");
  const [creditCardCVV, setCreditCardCVV] = useState("");
  const [creditCardLimit, setCreditCardLimit] = useState(0.0);
  const [loadingDebitInfo, setLoadingDebitInfo] = useState(false); //load debit card info
  const [loadingCreditInfo, setLoadingCreditInfo] = useState(false); //load credit card info
  const [editDebitInfo, setEditDebitInfo] = useState(false); //edit debit limit
  const [editCreditInfo, setEditCreditInfo] = useState(false); //edit credit limit

  useEffect(() => {
    fetchDebitCardDetails();
    fetchCreditCardDetails();
  }, []);

  const editCredit = () => {
    setEditCreditInfo(true);
  };

  const editDebit = () => {
    setEditDebitInfo(true);
  };

  const fetchDebitCardDetails = async () => {
    const token = localStorage.getItem("token");
    setLoadingDebitInfo(true);

    try {
      const response = await fetch("http://localhost:8080/user/getDebitCard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDebitCardNumber(data.debitCardNumber);
      setDebitCardExpireDate(data.debitExpiryDate);
      setDebitCardCVV(data.cvv);
      setDebitCardLimit(data.debitCardLimit);
    } catch (error) {
      console.error("Error fetching debit card details:", error);
    } finally {
      setLoadingDebitInfo(false);
    }
  };

  const fetchCreditCardDetails = async () => {
    const token = localStorage.getItem("token");
    setLoadingCreditInfo(true);

    try {
      const response = await fetch("http://localhost:8080/user/getCreditCard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCreditCardNumber(data.creditCardNumber);
      setCreditCardExpireDate(data.creditExpiryDate);
      setCreditCardCVV(data.cvv);
      setCreditCardLimit(data.creditCardLimit);
    } catch (error) {
      console.error("Error fetching credit card details:", error);
    } finally {
      setLoadingCreditInfo(false);
    }
  };

  return (
    <>
      <div className="card-info-background">
        <div className="card-container">
          <div className="debit-card-container">
            <img className="debit-card" src={debitCard} alt="Debit Card"></img>
            <div className="debit-card-details">
              <p>
                <strong>Debit Card Number: </strong> {debitCardNumber}
              </p>
              <p>
                <strong>Expiry Date: </strong> {debitCardExpireDate}
              </p>
              <p>
                <strong>CVV: </strong> {debitCardCVV}
              </p>
              <p>
                <strong>Card Limit: </strong> {debitCardLimit.toFixed(2)}
                <img
                  className="edit"
                  src={edit}
                  alt="edit"
                  onClick={editDebit}
                ></img>
              </p>
            </div>
          </div>
          <div className="credit-card-container">
            <img
              className="credit-card"
              src={creditCard}
              alt="Credit Card"
            ></img>
            <div className="credit-card-details">
              <p>
                <strong>Credit Card Number: </strong> {creditCardNumber}
              </p>
              <p>
                <strong>Expiry Date: </strong> {creditCardExpireDate}
              </p>
              <p>
                <strong>CVV: </strong> {creditCardCVV}
              </p>
              <p>
                <strong>Card Limit: </strong> {creditCardLimit.toFixed(2)}
                <img
                  className="edit"
                  src={edit}
                  alt="edit"
                  onClick={editCredit}
                ></img>
              </p>
            </div>
          </div>
        </div>
      </div>
      {loadingCreditInfo && loadingDebitInfo && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Loading information...</h2>
            <p>Please give us a moment...</p>
          </div>
        </div>
      )}
      {editDebitInfo && (
        <EditDebitInfoModal
          debitCardLimit={debitCardLimit}
          setDebitCardLimit={setDebitCardLimit}
          setEditDebitInfo={setEditDebitInfo}
        />
      )}
      {editCreditInfo && (
        <EditCreditInfoModal
          creditCardLimit={creditCardLimit}
          setCreditCardLimit={setCreditCardLimit}
          setEditCreditInfo={setEditCreditInfo}
        />
      )}
    </>
  );
};

export default CardDetails;
