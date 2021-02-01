import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import style from "../CSS/login.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword({ token }) {
  const [input, setInput] = useState({ password: "", password2: "" });
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (input.password !== input.password2) {
      setError("Las contraseñas no coinciden");
    } else {
      setError(null);
    }
  }, [input, setError]);

  const handleSubmit = async (e) => {
    const handlePass = await axios
      .put(`${process.env.REACT_APP_API}/users/passwordReset/${token}`, {
        password: input.password,
        password2: input.password2,
      })
      .then((res) => {
        if (res.status === 204) {
          setError("Token invalido o expirado");
        } else {
          toast.success("Se ha enviado un email a tu correo", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
  };

  return (
    <div className={style.fondo}>
      <>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className={style.loginbox}>
          <h1>Cambiar contraseña</h1>
          <div className={style.textbox}>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              onChange={handleChange}
            />
          </div>
          <div className={style.textbox}>
            <input
              onChange={handleChange}
              name="password2"
              type="password"
              placeholder="Repite contraseña"
            />
          </div>
          {!error && input.password ? (
            <input
              type="submit"
              onClick={handleSubmit}
              className={style.btn}
              value="Cambiar"
            />
          ) : (
            <p>{error}</p>
          )}
        </div>
      </>
    </div>
  );
}
