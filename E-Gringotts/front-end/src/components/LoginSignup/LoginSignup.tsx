import email_icon from "./email.png";
import password_icon from "./password.png";
import user_icon from "./person.png";
import "./LoginSignup.css";
import LoginMain from "../LoginMainPages/login-main";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [pin, setPin] = useState("");
  const [currentPage, setCurrentPage] = useState<string>("");
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "" || pin.trim() === "") {
      alert("Please enter all fields.");
      return;
    }
    console.log("Logging in with email:", email, "and password:", password);
    navigate("/login-main");
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      email.trim() === "" ||
      password.trim() === "" ||
      age.trim() === "" ||
      dob.trim() === "" ||
      pin.trim() === "" ||
      name.trim() === ""
    ) {
      alert("Please enter all fields.");
      return;
    }
    console.log("Registering with email:", email, "and password:", password);
    navigate("/login-main");
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPin(value);
    }
  };

  if (currentPage === "/login-main") {
    return <LoginMain />; // Redirect to /login-main if currentPage is /login-main
  }

  return (
    <div className="background">
      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {action === "Login" ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="input">
                <img src={email_icon} alt="" />
                <input
                  type="email"
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input">
                <img src={password_icon} alt="" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input">
                <img src={password_icon} alt="" />
                <input
                  type="password"
                  placeholder="6 digit secure pin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="submit-container submit submit-button"
              >
                Submit
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="input">
                <img src={user_icon} alt="" />
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input">
                <img src={user_icon} alt="" />
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="input">
                <img src={user_icon} alt="" />
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="input">
                <img src={email_icon} alt="" />
                <input
                  type="email"
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input">
                <img src={password_icon} alt="" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input">
                <img src={password_icon} alt="" />
                <input
                  type="password"
                  placeholder="6 digit secure pin"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    handlePinChange(e);
                  }}
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="submit-container submit submit-button"
              >
                Submit
              </button>
            </form>
          )}
        </div>
        <div>
          {action === "Sign Up" ? (
            <div />
          ) : (
            <div className="forgot-password">
              Forgot password? <span>Click here!</span>
            </div>
          )}
        </div>
        <div className="submit-container">
          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={() => {
              setAction("Sign Up");
            }}
          >
            Sign up
          </div>
          <div
            className={action === "Sign Up" ? "submit gray" : "submit"}
            onClick={() => {
              setAction("Login");
            }}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
