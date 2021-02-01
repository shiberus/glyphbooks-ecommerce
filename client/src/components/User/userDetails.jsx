import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../../CSS/userDetails.module.scss";

export default function UserDetails({ user, setLocalUser, localUser }) {
  const [check, setCheck] = useState(false);
  const [input, setInput] = useState({ ...user });
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/users/${user.id}`)
      .then(({ data }) => {
        setUsuario(data);
      });
  }, {});

  const handleSubmit = () => {
    axios
      .put(`${process.env.REACT_APP_API}/users/${user.id}`, input)
      .then(({ data }) => {
        setLocalUser({ ...localUser, user: data });
        setCheck(!check);
      });
  };

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={style.container}>
      <table className={style.users}>
        <tr className={style.tr}>
          <th className={style.th}>Nombre</th>
          <th className={style.th}>Apellido</th>
          <th className={style.th}>Email</th>
          <th className={style.th}>Direccion</th>
          <th className={style.th}>Rol</th>
        </tr>
        <tr>
          <td className={style.td}>{user.firstName}</td>
          <td className={style.td}>{user.lastName}</td>
          <td className={style.td}>{user.email}</td>
          <td className={style.td}>{usuario.shippingAdress}</td>
          <td className={style.td}>{user.isAdmin ? "Admin" : "Usuario"}</td>
        </tr>
      </table>
      <button className={style.btn} onClick={() => setCheck(!check)}>
        Editar
      </button>

      {check && (
        <div className={style.textbox}>
          <input
            type="text"
            name="firstName"
            placeholder="*nombre"
            onChange={handleChange}
            value={input.firstName}
          />
          <input
            type="text"
            name="lastName"
            placeholder="*apellido"
            onChange={handleChange}
            value={input.lastName}
          />
          <input
            type="text"
            name="email"
            placeholder="*email"
            onChange={handleChange}
            value={input.email}
          />
          <input
            type="text"
            name="shippingAdress"
            placeholder="dirección"
            onChange={handleChange}
            value={input.shippingAdress}
          />
          <button
            disabled={!input.firstName || !input.lastName || !input.email}
            className={style.btn}
            onClick={handleSubmit}
          >
            Hecho
          </button>
        </div>
      )}
    </div>
  );
}
