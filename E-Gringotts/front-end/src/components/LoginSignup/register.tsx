import email_icon from "./email.png";
import password_icon from "./password.png";
import user_icon from "./person.png";
import "./LoginSignup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardDetails from "../LoginMainPages/card-info";
import RegisterModal from "./register-modal";
import LoginModal from "./login-modal";

interface RegisterProps {
  setIsLoggedIn: React.Dispatch<boolean>;
}

const Register = ({ setIsLoggedIn }: RegisterProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [pin, setPin] = useState("");
  const [creating, setCreating] = useState(false); //creating account modal
  const [showModal, setShowModal] = useState(false); //logged in successful modal
  const navigate = useNavigate();

  const isValidPassword = (password: string): boolean => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !dob || !pin || !name) {
      alert("Please enter all fields.");
      return;
    }

    if (!isValidPassword(password)) {
      alert(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character."
      );
      return;
    }

    const userDetails = {
      name,
      dateOfBirth: dob,
      email,
      password,
      securityPin: pin,
    };

    try {
      setCreating(true);

      const response = await fetch("http://localhost:8080/register", {
        // Change this if your backend is running on a different port
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (response.ok) {
        const user = await response.json();
        console.log("Registration successful", user);
        setIsLoggedIn(true);
        sessionStorage.setItem("isLoggedIn", "true");
        setShowModal(true);
        setTimeout(() => {
          navigate("/login-main");
        }, 3000);
      } else if (response.status === 409) {
        alert("Email already exists. Please enter another one.");
      } else {
        throw new Error(`Failed to register. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setCreating(false);
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
      {showModal && <LoginModal />}
      {creating && <RegisterModal />}
    </div>
  );
};

export default Register;
