import "../App.css";

const LoginMain = () => {
  const mainText = () => {
    return "The first digital bank. \n Register now.";
  };

  return (
    <>
      <div className="background"></div>
      <div className="center-text transparent-text">{mainText()}</div>
    </>
  );
};

export default LoginMain;
