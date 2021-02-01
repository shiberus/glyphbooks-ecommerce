import React from "react";
import { useHistory } from "react-router-dom";
import style from "../../CSS/userSideBar.module.scss";

export default function UserSidebar({ user, logOut }) {
  const { push } = useHistory();

  return (
    <div className={style.container}>
      <h1>{user.firstName + " " + user.lastName}</h1>
      <ul>
        <li onClick={() => push(`/cuenta/details`)}>Detalles</li>
        <li onClick={() => push(`/cuenta/orders`)}>Compras</li>
        {user.isAdmin && <li onClick={() => push(`/admin/products`)}>ADMIN</li>}

        <button onClick={logOut}>LogOut</button>
      </ul>
    </div>
  );
}
