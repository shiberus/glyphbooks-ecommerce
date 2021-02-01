import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import style from "../../CSS/userOrders.module.scss";

export default function UserOrders({ user }) {
  const [order, setOrder] = useState([]);
  const { push } = useHistory();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/users/${user.id}/orders`)
      .then(({ data }) => {
        setOrder(data);
      });
  }, [user]);
  return (
    <div className={style.container}>
      <table className={style.orders}>
        <tr className={style.tr}>
          <th className={style.th} h>
            ID
          </th>
          <th className={style.th}>Status</th>
          <th className={style.th}>Creation Date</th>
          <th className={style.th}>Detalles</th>
        </tr>
        {order.length &&
          order.map((orden) => (
            <tr className={style.tr}>
              <td className={style.td}>{orden.id}</td>
              <td className={style.td}>{orden.status}</td>
              <td className={style.td}>{orden.createdAt}</td>
              <td className={style.td}>
                <ion-icon
                  name="information-circle-outline"
                  color="var(--color-primary)"
                  onClick={() => push(`/cuenta/orderDetails/${orden.id}`)}
                ></ion-icon>
              </td>
            </tr>
          ))}
      </table>
    </div>
  );
}
