import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import style from "../../CSS/Admin/userDetails.module.scss";

function useQuery() {
  let url = useLocation();
  let result = url.pathname.split("/");
  let userID = result[result.length - 1];
  return userID;
}

export default function UserDetails() {
  const userID = useQuery();
  const [user, setUser] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/users/${userID}`)
      .then(({ data }) => {
        setUser(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, [userID]);

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
          <td className={style.td}>{user.shippingAdress}</td>
          <td className={style.td}>{user.isAdmin ? "Admin" : "User"}</td>
        </tr>
      </table>
    </div>
  );
}
