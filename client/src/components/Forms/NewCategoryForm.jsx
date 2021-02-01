import Axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import style from "../../CSS/newcategory.module.scss";

export default function NewForm() {
  const [input, setInput] = useState({
    name: "",
    description: "",
  });

  const { push } = useHistory();

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    Axios.post(`${process.env.REACT_APP_API}/category`, input).then(() => {
      alert("category was submitted");
      push("/catalogo");
    });

    e.preventDefault();
  };

  return (
    <div className={style.fondo}>
      <form onSubmit={handleSubmit} className={style.form}>
        <h1>CREAR CATEGORIA</h1>
        <div className={style.textbox}>
          <input
            placeholder="Nombre"
            type="text"
            value={input.name}
            name="name"
            onChange={handleChange}
          />
        </div>
        <div className={style.textbox}>
          <input
            placeholder="Descripcion"
            type="text"
            value={input.description}
            name="description"
            onChange={handleChange}
          />
        </div>
        <input className={style.btn} type="submit" value="Submit" />
      </form>
    </div>
  );
}
