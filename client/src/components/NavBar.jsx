import React from "react";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
import style from "../CSS/navbar.module.scss";
import icon from "../template/Images/logo.svg";
import ShoppingBagIcon from "./Icons/ShoppingBagIcon";
import SearchBar from "./Catalogo/searchBar";

export default function NavBar(props) {
  // const { user } = useSelector((state) => state.user);
  /* const test = () => {
    console.log(user);
  }; */
  return (
    <nav className={style.nav}>
      <div className={style.logo}>
        <img src={icon} alt="Logo" />
        <h1>GlyphBooks</h1>
      </div>
      <ul className={style.links}>
        <li>
          <SearchBar />
        </li>
        <li>
          <Link className={style.active} to="/">
            Home
          </Link>
        </li>
        <li>
          <Link to="/catalogo">Catalogo</Link>
        </li>
        <li>
          <Link to="/faq">FAQ</Link>
        </li>
        <li>
          {!props.localUser ? (
            <Link to="/ingresar">Ingresar</Link>
          ) : (
            <Link to="/cuenta/details">Cuenta</Link>
          )}
        </li>
        <li>
          <ShoppingBagIcon onClick={props.onCartClick} size={24} />
        </li>
        {/*  <li>
          <Link to="/forgot">
            <ion-icon name="person-circle-outline"></ion-icon>
          </Link>
        </li> */}
      </ul>
    </nav>
  );
}
