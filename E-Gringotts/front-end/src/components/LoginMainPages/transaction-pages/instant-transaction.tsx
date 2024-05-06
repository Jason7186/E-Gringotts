import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";
import "./instant-transaction.css";

const InstantTransaction = () => {
  return (
    <>
      <TransactionSidebar />
      <div className="transaction-container">
        <div className="amount-container">{/*amount*/}</div>
        <div className="transfer-container"></div>
      </div>
    </>
  );
};

export default InstantTransaction;
