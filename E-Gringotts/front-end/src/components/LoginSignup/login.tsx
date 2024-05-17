import email_icon from "./email.png";
import password_icon from "./password.png";
import "./LoginSignup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setIsLoggedIn: React.Dispatch<boolean>;
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "" || pin.trim() === "") {
      alert("Please enter all fields.");
      return;
    }

    console.log("Login successful");
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true");
    navigate("/login-main");

    // const loginDetails = {
    //   email: email,
    //   password: password,
    //   pin: pin, // Ensure backend handles this if necessary
    // };

    // try {
    //   const response = await fetch("http://localhost:5173/login", {
    //     // Update backend URL
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(loginDetails),
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     console.log("Login successful", result);
    //     setIsLoggedIn(true);
    //     sessionStorage.setItem("isLoggedIn", "true");
    //     navigate("/login-main");
    //   } else {
    //     throw new Error("Failed to login");
    //   }
    // } catch (error) {
    //   console.error("Login error:", error);
    //   alert("Login failed. Please check your credentials.");
    // }
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
        <div className="forgot-password">
          Forgot password? <span>Click here!</span>
        </div>
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
    </div>
  );
};

export default Login;
