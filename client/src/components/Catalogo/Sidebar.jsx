import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../../CSS/sideBar.module.scss";
import { buscarProductos } from "../../actions/actions";
import { useDispatch } from "react-redux";

export default function SideBar({ setCategory }) {
  const [categorias, setCategorias] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/category`).then(({ data }) => {
      setCategorias(data);
    });
  }, []);

  return (
    <div className={style.Categorias}>
      <h1 className={style.Title}>CATEGORIAS</h1>
      <ul className={style.Lista}>
        <li
          className={style.category}
          onClick={() => {
            dispatch(buscarProductos(""));
            setCategory(0);
          }}
        >
          Todo
        </li>
        {categorias.length &&
          categorias.map((category) => (
            <li
              key={category.id}
              className={style.category}
              onClick={() => {
                dispatch(buscarProductos(""));
                setCategory(category.id);
              }}
            >
              {category.name}
            </li>
          ))}
      </ul>
    </div>
  );
}
