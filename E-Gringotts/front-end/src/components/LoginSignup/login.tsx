import email_icon from "./email.png";
import password_icon from "./password.png";
import "./LoginSignup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./login-modal";
import LoadingModal from "./LoadingModal";

interface LoginProps {
  setIsLoggedIn: React.Dispatch<boolean>;
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [showModal, setShowModal] = useState(false); //logged in successful modal
  const [isLoading, setIsLoading] = useState(false); //loading details modal
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "" || pin.trim() === "") {
      alert("Please enter all fields.");
      return;
    }

    setIsLoading(true);

    const loginDetails = {
      email: email,
      password: password,
      pin: pin,
    };

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetails),
      });

      setIsLoading(false);

      if (response.ok) {
        const result = await response.json();
        console.log("Login successful", result);
        setIsLoggedIn(true);
        sessionStorage.setItem("isLoggedIn", "true");
        setShowModal(true);
        setTimeout(() => {
          navigate("/login-main");
        }, 3000);
      } else {
        throw new Error("Failed to login");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPin(value);
    }
  };

  return (
    <div className="background">
      <div className="container">
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
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
                onChange={handlePinChange}
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
        </div>
        {/*<div className="forgot-password">
          Forgot password? <span>Click here!</span>
  </div>*/}
        <div className="submit-container">
          <div
            className="submit"
            onClick={() => {
              navigate("/register");
            }}
          >
            Sign up
          </div>
        </div>
      </div>
      {isLoading && <LoadingModal />}
      {showModal && <LoginModal />}
    </div>
  );
};

export default Login;
