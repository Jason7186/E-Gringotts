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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
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
            path="/register"
            element={<LoginSignup setIsLoggedIn={setIsLoggedIn} />}
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
        </Routes>
      </div>
    </>
  );
}

export default App; //export so it can be used somewhere else
