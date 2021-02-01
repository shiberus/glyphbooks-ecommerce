import React from "react";
import style from "../../CSS/sortBar.module.scss";

export default function SortBar({ setSort, sort }) {
  const handleClick = (e) => {
    let newOrder = JSON.stringify([[e.target.title, "ASC"]]);
    (newOrder === sort || e.target.title === "discount") &&
      (newOrder = JSON.stringify([[e.target.title, "DESC"]]));
    setSort(newOrder);
  };

  return (
    <nav className={style.barra}>
      <p>Ordenar por:</p>
      <ul className={style.btns}>
        <li title={"price"} onClick={handleClick}>
          Precio
        </li>
        <li title={"title"} onClick={handleClick}>
          Titulo
        </li>
        <li title={"author"} onClick={handleClick}>
          Autor
        </li>
        <li title={"discount"} onClick={handleClick}>
          Ofertas
        </li>
      </ul>
    </nav>
  );
}
