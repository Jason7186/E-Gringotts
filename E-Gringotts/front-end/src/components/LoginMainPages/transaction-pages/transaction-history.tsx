import React, { useState, useEffect } from "react";
import "./transaction-history.css";
import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";

interface Transaction {
  transactionId: string;
  dateTime: string;
  amount: number;
  type: string;
  sender: string;
  senderId: string;
  receiver: string;
  receiverId: string;
  category: string;
  details: string;
}

const TransactionHistory: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [fetching, setFetching] = useState(false); //after select, fetching history
  const [transactionTypes, setTransactionTypes] = useState<{
    [key: string]: boolean;
  }>({
    "Oversea Transfer": false,
    "Instant Transfer": false,
    Deposit: false,
  });
  const [categories, setCategories] = useState<{ [key: string]: boolean }>({
    "Fund Transfer": false,
    "Food and Beverage": false,
    Transportation: false,
    Entertainment: false,
    Housing: false,
    Medical: false,
    Social: false,
    "General Goods": false,
    "Magical Items": false,
    Others: false,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleDateChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    date: string
  ) => {
    setter(date);
  };

  const handleCheckboxChange = (
    setter: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
    key: string
  ) => {
    setter((prevState) => ({ ...prevState, [key]: !prevState[key] }));
  };

  const handleApply = async () => {
    setFetching(true);
    const selectedTransactionTypes = Object.keys(transactionTypes).filter(
      (type) => transactionTypes[type]
    );
    const selectedCategories = Object.keys(categories).filter(
      (category) => categories[category]
    );

    const typesParam = selectedTransactionTypes.join(",");
    const categoriesParam = selectedCategories.join(",");
    const token = localStorage.getItem("token");

    let url = `http://localhost:8080/login-transaction/transaction-history?type=${typesParam}&category=${categoriesParam}`;

    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    if (endDate) {
      url += `&endDate=${endDate}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTransactions(data);
      console.log(data);
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setFetching(false);
    }
    console.log({ startDate });
    console.log({ endDate });
    console.log({ selectedTransactionTypes });
    console.log({ selectedCategories });
  };

  return (
    <>
      <TransactionSidebar />
      <div className="transaction-history-background">
        <div className="transaction-history-container">
          <div className="transaction-history-box">
            <h3 style={{ color: "white" }}>Transaction History</h3>
            {transactions.map((transaction) => (
              <div key={transaction.transactionId} className="transaction-item">
                <p>
                  <strong>Date:</strong> {transaction.dateTime}
                </p>
                <p>
                  <strong>Amount:</strong> {transaction.amount}
                </p>
                <p>
                  <strong>Type:</strong> {transaction.type}
                </p>
                <p>
                  <strong>Sender:</strong> {transaction.sender} (
                  {transaction.senderId})
                </p>
                <p>
                  <strong>Receiver:</strong> {transaction.receiver} (
                  {transaction.receiverId})
                </p>
                <p>
                  <strong>Category:</strong> {transaction.category}
                </p>
                <p>
                  <strong>Details:</strong> {transaction.details}
                </p>
              </div>
            ))}
          </div>
          <div className="selection-box">
            <div className="selection-box-content">
              <div className="selection-box-left">
                <div>
                  <label>
                    <h3>Start Date</h3>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) =>
                        handleDateChange(setStartDate, e.target.value)
                      }
                    />
                  </label>
                  <label>
                    <h3>End Date</h3>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) =>
                        handleDateChange(setEndDate, e.target.value)
                      }
                    />
                  </label>
                </div>
                <div>
                  <h3>Transaction Type</h3>
                  {Object.keys(transactionTypes).map((type) => (
                    <label key={type}>
                      <input
                        type="checkbox"
                        checked={transactionTypes[type]}
                        onChange={() =>
                          handleCheckboxChange(setTransactionTypes, type)
                        }
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <div className="selection-box-right">
                <div>
                  <h3>Category(s)</h3>
                  {Object.keys(categories).map((category) => (
                    <label key={category}>
                      <input
                        type="checkbox"
                        checked={categories[category]}
                        onChange={() =>
                          handleCheckboxChange(setCategories, category)
                        }
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <p>*Select all that applies*</p>
            <button onClick={handleApply}>Apply</button>
          </div>
        </div>
      </div>
      {fetching && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Retrieving History...</h2>
            <p>Going through all the records...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionHistory;
