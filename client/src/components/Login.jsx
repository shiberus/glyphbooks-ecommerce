import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../CSS/login.module.scss";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { agregarVarios } from "../actions/actions";
import { useMemo } from "react";
import jwt from "jsonwebtoken";
import google from "../template/Images/google-logo.png";

export default function Login({ setLocalUser }) {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const [input, setInput] = useState({ email: "", password: "" });
  const { search } = useLocation();
  const query = useMemo(() => {
    const result = search.slice(1).split("&");
    return result.reduce((data, item) => {
      const pair = item.split("=");
      data[pair[0]] = pair[1];
      return data;
    }, {});
  }, [search]);

  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (query.token) {
      const user = jwt.decode(query.token);
      setLocalUser({ token: query.token, user });
      const idUser = user.id;
      if (items.length) {
        axios
          .post(`${process.env.REACT_APP_API}/users/${idUser}/cart`, {
            id: items[0].id,
            price: items[0].price,
          })
          .then(() =>
            Promise.all(
              items.map((p) => {
                let request = {
                  id: p.id,
                  price: p.price,
                  quantity: p.lineOrder.quantity,
                };
                return axios.post(
                  `${process.env.REACT_APP_API}/users/${idUser}/cart`,
                  request
                );
              })
            )
          )
          .then(() => {
            return axios.get(
              `${process.env.REACT_APP_API}/users/${idUser}/cart`
            );
          })
          .then(({ data }) => {
            if (data[0]) {
              dispatch(agregarVarios(data[0].products));
            }
            push("/");
          });
      } else {
        axios
          .get(`${process.env.REACT_APP_API}/users/${idUser}/cart`)
          .then(({ data }) => {
            if (data[0]) {
              dispatch(agregarVarios(data[0].products));
            }
            push("/");
          });
      }
    }
  }, [query, dispatch, items, push, setLocalUser]);
  console.log(search);

  const handleSubmit = (e) => {
    var idUser;
    axios
      .post(`${process.env.REACT_APP_API}/auth/login`, input)
      .then(({ data }) => {
        setLocalUser(data);
        idUser = data.user.id;
      })
      .then(() => {
        if (items.length) {
          return axios
            .post(`${process.env.REACT_APP_API}/users/${idUser}/cart`, {
              id: items[0].id,
              price: items[0].price,
            })
            .then(() =>
              Promise.all(
                items.map((p) => {
                  let request = {
                    id: p.id,
                    price: p.price,
                    quantity: p.lineOrder.quantity,
                  };
                  return axios.post(
                    `${process.env.REACT_APP_API}/users/${idUser}/cart`,
                    request
                  );
                })
              )
            );
        }
      })
      .then(() => {
        return axios.get(`${process.env.REACT_APP_API}/users/${idUser}/cart`);
      })
      .then(({ data }) => {
        if (data[0]) {
          dispatch(agregarVarios(data[0].products));
        }
        push("/");
      })
      .catch((error) => {
        console.log(error);
        alert("usuario y/o contraseña incorrecta");
      });
  };
  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={style.fondo}>
      <div className={style.loginbox}>
        <h1>Ingresar</h1>
        <div className={style.textbox}>
          <input
            name="email"
            onChange={handleChange}
            value={input.email}
            type="text"
            placeholder="Email"
          />
        </div>
        <div className={style.textbox}>
          <input
            name="password"
            onChange={handleChange}
            value={input.password}
            type="password"
            placeholder="Contraseña"
          />
        </div>
        <input
          onClick={handleSubmit}
          type="button"
          className={style.btn}
          value="Ingresar"
        />
        <input
          onClick={() => push("/signup")}
          value="Crear cuenta"
          type="button"
          className={style.btn}
        />
        <button
          className={style.btn}
          onClick={() =>
            (window.location = `${process.env.REACT_APP_API}/auth/login/auth/google`)
          }
        >
          <img src={google} alt="" />
          ingresar con Google
        </button>
        {/* <button
          onClick={() =>
            (window.location = `${process.env.REACT_APP_API}/auth/login/auth/facebook`)
          }
        >
          <i className="fab fa-facebook"></i>
        </button> */}
        <a onClick={() => push("/forgot")}>¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  );
}
