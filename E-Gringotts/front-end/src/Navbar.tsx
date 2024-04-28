import "./style.css";
import logoPic from "./logo.png";
import { useState } from "react";

interface NavbarProps {
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
  return isLoggedIn ? (
    <>
      <nav className="nav">
        <a href="/login-main" className="logoPic">
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
      </nav>
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
