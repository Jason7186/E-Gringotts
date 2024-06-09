import emailIcon from "./email.png";
import passwordIcon from "./password.png";
import "./LoginSignup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./login-modal";
import LoadingModal from "./LoadingModal";
import "../LoginMainPages/transaction-pages/Modal.css";

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [forgetEmail, setForgetEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forgetPassword, setForgetPassword] = useState<boolean>(false); // after submit send otp
  const [resetPassword, setResetPassword] = useState<boolean>(false); // after send otp
  const [resetSuccessful, setResetSuccessful] = useState<boolean>(false); // after reset success
  const [sendOtp, setSendOtp] = useState<boolean>(false); // sending otp
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false); // resetting password
  const navigate = useNavigate();

  const isValidPassword = (password: string): boolean => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Handle login submission
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter all fields.");
      return;
    }

    setIsLoading(true);

    const loginDetails = {
      email,
      password,
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
        localStorage.setItem("token", result.token);
        console.log("Login successful", result);
        setIsLoggedIn(true);
        sessionStorage.setItem("isLoggedIn", "true");
        setShowModal(true);
        setTimeout(() => {
          navigate("/login-main");
        }, 3000);
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forget password click
  const clickForgetPassword = () => {
    setForgetPassword(true);
  };

  // Handle forget password request
  const handleForgetPassword = async () => {
    if (forgetEmail.trim() === "") {
      alert("Please enter your email.");
      return;
    }

    setSendOtp(true);
    const forgetPasswordDetails = {
      email: forgetEmail,
    };

    try {
      const response = await fetch("http://localhost:8080/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forgetPasswordDetails),
      });

      if (response.ok) {
        setResetPassword(true);
      } else {
        alert("Failed to send OTP. Please try again later.");
      }
    } catch (error) {
      console.error("OTP error:", error);
      alert("Failed to send OTP. Please try again later.");
    } finally {
      setSendOtp(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (otp.trim() === "" || newPassword.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    if (!isValidPassword(newPassword)) {
      alert(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character."
      );
      return;
    }

    setIsResettingPassword(true);
    const resetPasswordDetails = {
      email: forgetEmail,
      otp,
      newPassword,
    };

    try {
      const response = await fetch("http://localhost:8080/user/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetPasswordDetails),
      });

      if (response.ok) {
        setResetSuccessful(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        alert("Failed to reset password. Please check the OTP.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Failed to reset password. Please check the OTP.");
    } finally {
      setIsResettingPassword(false);
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
              <img src={emailIcon} alt="Email Icon" />
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input">
              <img src={passwordIcon} alt="Password Icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="submit-container submit submit-button">
              Submit
            </button>
          </form>
        </div>
        <div className="forgot-password">
          Forgot password? <span onClick={clickForgetPassword}>Click here!</span>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={() => navigate("/register")}>
            Sign up
          </div>
        </div>
      </div>
      {isLoading && <LoadingModal />}
      {showModal && <LoginModal />}
      {forgetPassword && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Enter Your Email</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgetEmail}
              onChange={(e) => setForgetEmail(e.target.value)}
            />
            <button onClick={handleForgetPassword}>Request OTP</button>
          </div>
        </div>
      )}
      {resetPassword && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>OTP sent to your Email</h2>
            <input
              type="text"
              placeholder="Enter OTP received in your email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleResetPassword}>Submit</button>
          </div>
        </div>
      )}
      {resetSuccessful && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Password reset successful</h2>
            <p>Redirecting back to main page...</p>
          </div>
        </div>
      )}
      {sendOtp && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Sending OTP...</h2>
            <p>Please give us a moment.</p>
          </div>
        </div>
      )}
      {isResettingPassword && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Resetting password for you...</h2>
            <p>Please give us a moment.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
