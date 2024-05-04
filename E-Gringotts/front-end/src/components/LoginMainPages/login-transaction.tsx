import TransactionSidebar from "./transaction-sidebar/transaction-sidebar";
import "./transaction-sidebar/transaction-sidebar.css";

const LoginTransaction = () => {
  return (
    <div className="background-transaction">
      <TransactionSidebar />
      <div>
        <h1 className="transaction-text">
          All your transactions in an instant. No magic, only E-Gringotts.
        </h1>
      </div>
    </div>
  );
};

export default LoginTransaction;
