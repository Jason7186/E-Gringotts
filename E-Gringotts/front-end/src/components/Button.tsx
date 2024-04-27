import { Link } from "react-router-dom";
import "./App.css";
import clickHandler from "../handlers/clickHandler";

interface props {
  page: string;
}

const Button = ({ page }: props) => {
  return (
    <div>
      <button className="transparent" onClick={clickHandler(page)}>
        {page}
      </button>
    </div>
  );
};

export default Button;
