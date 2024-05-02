import "./style.css";
import logoPic from "./logo.png";
import person from "./person.png";
import DropDownProfile from "./dropdownProfile";
import { useState } from "react";

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const [openProfile, setOpenProfile] = useState(false);

  return isLoggedIn ? (
    <>
      <nav className="nav">
        <a href="/login-main" className="logoPic">
          <img src={logoPic} alt="Logo" className="logoPic" />
        </a>

        <ul>
          <li>
            <a href="/login-currency-conversion">Currency Conversion</a>
          </li>
          <li>
            <a href="/login-expenses">Expenses</a>
          </li>
          <li>
            <a href="/login-transaction">Transaction</a>
          </li>
          <li>
            <a href="/login-help">Help</a>
          </li>
        </ul>
        <div className="circle">
          <img
            src={person}
            alt="Icon"
            onClick={() => {
              setOpenProfile((prev) => !prev);
            }}
          />
        </div>
      </nav>
      {openProfile && <DropDownProfile setIsLoggedIn={setIsLoggedIn} />}
    </>
  ) : (
    <>
      <nav className="nav">
        <a href="/" className="logoPic">
          <img src={logoPic} alt="Logo" className="logoPic" />
        </a>

        <ul>
          <li>
            <a href="/currency-conversion">Currency Conversion</a>
          </li>
          <li>
            <a href="/expenses">Expenses</a>
          </li>
          <li>
            <a href="/transaction">Transaction</a>
          </li>
          <li>
            <a href="/help">Help</a>
          </li>
        </ul>
        <a href="/register" className="purpleButton">
          Register now
        </a>
      </nav>
    </>
  );
};

export default Navbar;
