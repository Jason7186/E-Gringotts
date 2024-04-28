import "../components/App.css";

const Help = () => {
  const mainText = () => {
    return "Ask Rain Poo.找下雨铺";
  };

  return (
    <>
      <div className="help-background"></div>
      <div className="center-text transparent-text">{mainText()}</div>
    </>
  );
};

export default Help;
