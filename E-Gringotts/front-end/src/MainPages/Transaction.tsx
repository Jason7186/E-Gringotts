import "../components/App.css";

const Transaction = () => {
  const mainText = () => {
    return "All your transactions, in one place.";
  };

  return (
    <>
      <div className="background"></div>
      <div className="center-text transparent-text">{mainText()}</div>
    </>
  );
};

export default Transaction;
