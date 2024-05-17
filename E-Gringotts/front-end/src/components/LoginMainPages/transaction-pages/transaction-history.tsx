import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";
import "./transaction-history.css";

const TransactionHistory = () => {
  return (
    <>
      <TransactionSidebar />
      <div className="transaction-history-background"></div>
    </>
  );
};

export default TransactionHistory;
