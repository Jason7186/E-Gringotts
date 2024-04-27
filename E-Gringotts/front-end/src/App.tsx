import MainPage from "./MainPage";
import Help from "./MainPages/Help";
import CurrencyConversion from "./MainPages/CurrencyCoversion";
import Transaction from "./MainPages/Transaction";
import Expenses from "./MainPages/Expenses";
import Navbar from "./Navbar";
import { Route, Routes } from "react-router-dom";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import LoginMain from "./components/LoginMainPages/login-main";

function App() {
  return (
    <>
      <Navbar />
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
          <Route path="/register" element={<LoginSignup />}></Route>
          <Route path="/login-main" element={<LoginMain />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App; //export so it can be used somewhere else
