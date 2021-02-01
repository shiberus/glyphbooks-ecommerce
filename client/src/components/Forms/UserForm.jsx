import React, { useState } from "react";
import axios from "axios";
import style from "../../CSS/newUser.module.scss";
import { useHistory } from "react-router-dom";

export default function NewForm() {
  const { push } = useHistory();
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    shippingAdress: "",
  });

  const [errors, setErrors] = useState({ campos: true, email: true });

  const validate = (input) => {
    let errors = {};
    if (!input.email) {
      errors.campos = "Todos los campos son obligatorios";
    } else if (!/\S+@\S+\.\S+/.test(input.email)) {
      errors.email = "Email invalido";
    }

    if (
      !input.firstName ||
      !input.lastName ||
      !input.password ||
      !input.shippingAdress
    ) {
      errors.campos = "Todos los campos son obligatorios";
    }

    return errors;
  };

  const handleChange = (e) => {
    setErrors(
      validate({
        ...input,
        [e.target.name]: e.target.value,
      })
    );

    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    axios
      .post(`${process.env.REACT_APP_API}/auth/register`, input)
      .then(() => {
        push("/");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setErrors({
            email: "este email ya esta vinvulado a una cuenta de Glyph Books",
          });
        } else {
          console.log(err);
        }
      });

    e.preventDefault();
  };

  return (
    <div className={style.fondo}>
      <form className={style.loginbox} onSubmit={handleSubmit}>
        <h1>Nuevo usuario</h1>
        <div className={style.textbox}>
          <input
            type="text"
            value={input.firstName}
            name="firstName"
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
        </div>
        <div className={style.textbox}>
          <input
            type="text"
            value={input.lastName}
            name="lastName"
            onChange={handleChange}
            placeholder="Apellido"
            required
          />
        </div>
        <div className={style.textbox}>
          <input
            type="password"
            value={input.password}
            name="password"
            onChange={handleChange}
            placeholder="Constraseña"
            required
          />
        </div>
        <div className={style.textbox}>
          <input
            type="email"
            value={input.email}
            name="email"
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className={style.textbox}>
          <input
            type="text"
            value={input.shippingAdress}
            name="shippingAdress"
            onChange={handleChange}
            placeholder="Dirección"
          />
        </div>
        {errors.email?.length || errors.campos?.length ? (
          <p>{errors.campos || errors.email}</p>
        ) : null}
        <input
          disabled={errors.campos || errors.email}
          type="submit"
          className={style.btn}
          value="Crear cuenta"
        />
      </form>
    </div>
  );
}
