import MainPage from "./MainPage";
import Help from "./MainPages/Help";
import CurrencyConversion from "./MainPages/CurrencyCoversion";
import Transaction from "./MainPages/Transaction";
import Expenses from "./MainPages/Expenses";
import Navbar from "./Navbar";
import { Route, Routes } from "react-router-dom";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import LoginMain from "./components/LoginMainPages/login-main";
import LoginCurrenyConversion from "./components/LoginMainPages/login-curreny-conversion";
import LoginExpenses from "./components/LoginMainPages/login-expenses";
import LoginTransaction from "./components/LoginMainPages/login-transaction";
import Loginhelp from "./components/LoginMainPages/login-help";
import { useState } from "react";
import Login from "./components/LoginSignup/login";
import Register from "./components/LoginSignup/register";
import Friends from "./components/LoginMainPages/transaction-pages/friends";
import OverseasTransaction from "./components/LoginMainPages/transaction-pages/overseas-transaction";
import InstantTransaction from "./components/LoginMainPages/transaction-pages/instant-transaction";
import Deposit from "./components/LoginMainPages/transaction-pages/deposit";
import TransactionHistory from "./components/LoginMainPages/transaction-pages/transaction-history";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div>
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route
            path="/currency-conversion"
            element={<CurrencyConversion />}
          ></Route>
          <Route path="/expenses" element={<Expenses />}></Route>
          <Route path="/transaction" element={<Transaction />}></Route>
          <Route path="/help" element={<Help />}></Route>
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          ></Route>
          <Route
            path="/register"
            element={<Register setIsLoggedIn={setIsLoggedIn} />}
          ></Route>
          <Route path="/login-main" element={<LoginMain />}></Route>
          <Route path="/login-expenses" element={<LoginExpenses />}></Route>
          <Route
            path="/login-transaction"
            element={<LoginTransaction />}
          ></Route>
          <Route
            path="/login-currency-conversion"
            element={<LoginCurrenyConversion />}
          ></Route>
          <Route path="/login-help" element={<Loginhelp />}></Route>
          <Route
            path="/login-transaction/friends"
            element={<Friends />}
          ></Route>
          <Route
            path="/login-transaction/overseas-transaction"
            element={<OverseasTransaction />}
          ></Route>
          <Route
            path="/login-transaction/instant-transaction"
            element={<InstantTransaction />}
          ></Route>
          <Route
            path="/login-transaction/deposit"
            element={<Deposit />}
          ></Route>
          <Route
            path="/login-transaction/transaction-history"
            element={<TransactionHistory />}
          ></Route>
        </Routes>
      </div>
    </>
  );
}

export default App; //export so it can be used somewhere else
