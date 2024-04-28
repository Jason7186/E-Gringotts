import "../components/App.css";

const Expenses = () => {
  const mainText = () => {
    return "Manage your expenses online with E-Gringotts.";
  };

  return (
    <>
      <div className="expenses-background"></div>
      <div className="center-text transparent-text">{mainText()}</div>
    </>
  );
};

export default Expenses;
