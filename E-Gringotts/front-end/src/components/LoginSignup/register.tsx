import email_icon from "./email.png";
import password_icon from "./password.png";
import user_icon from "./person.png";
import "./LoginSignup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RegisterProps {
  setIsLoggedIn: React.Dispatch<boolean>;
}

const Register = ({ setIsLoggedIn }: RegisterProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [dob, setDob] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      email.trim() === "" ||
      password.trim() === "" ||
      dob.trim() === "" ||
      pin.trim() === "" ||
      name.trim() === ""
    ) {
      alert("Please enter all fields.");
      return;
    }

    console.log("Registration successful");
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true");
    navigate("/login-main");

    // const userDetails = {
    //   name,
    //   dateOfBirth: dob,
    //   email,
    //   password,
    //   securityPin: pin,
    // };

    // try {
    //   const response = await fetch("http://localhost:5173/register", {
    //     // Make sure this URL matches your Spring Boot endpoint
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(userDetails),
    //   });

    //   if (response.ok) {
    //     const user = await response.json();
    //     console.log("Registration successful", user);
    //     setIsLoggedIn(true);
    //     sessionStorage.setItem("isLoggedIn", "true");
    //     navigate("/login-main"); // Navigate to the main login area after successful registration
    //   } else {
    //     throw new Error("Registration failed");
    //   }
    // } catch (error) {
    //   console.error("Registration error:", error);
    //   alert("Registration failed. Please try again.");
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
          <div className="text">Sign Up</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
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
        <div className="submit-container">
          <div
            className="submit"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
