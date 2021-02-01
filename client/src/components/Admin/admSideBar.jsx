import React from "react";
import { useHistory } from "react-router-dom";
import style from "../../CSS/Admin/adminSideBar.module.scss";

export default function AdmSideBar() {
  const { push } = useHistory();
  return (
    <div className={style.sideBar}>
      <h1 className={style.title}>ADMIN</h1>
      <ul className={style.lista}>
        <li className={style.option} onClick={() => push(`/admin/products`)}>Productos</li>
        <li className={style.option} onClick={() => push(`/admin/orders`)}> Ordenes</li>
        <li className={style.option} onClick={() => push(`/admin/users`)}>Usuarios</li>
        <li className={style.option} onClick={() => push(`/admin/reviews`)}>Reviews</li>
      </ul>
    </div>
  );
}
