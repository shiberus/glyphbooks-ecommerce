import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import style from "../../CSS/Admin/adminOrderTable.module.scss";

export default function OrderTable() {
  const [order, setOrder] = useState([]);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(0);
  const { push } = useHistory();
  const pageLimit = Math.ceil(order.count / 12);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API}/order?page=${page}&order=${sort}&admin=true`
      )
      .then(({ data }) => {
        setOrder(data);
      });
  }, [page, sort, status]);

  const handleSort = (name) => {
    let newOrder = JSON.stringify([[name, "ASC"]]);
    newOrder === sort && (newOrder = JSON.stringify([[name, "DESC"]]));
    setSort(newOrder);
  };

  const handleChange = (e) => {
    e.preventDefault();
    axios
      .put(`${process.env.REACT_APP_API}/order/${e.target.name}`, {
        status: e.target.value,
      })
      .then(() => {
        setStatus(status + 1);
      });
  };

  return (
    <div className={style.size}>
      <table className={style.orders}>
        <tr>
          <th className={style.th}>
            ID
            <ion-icon
              name="chevron-down-outline"
              onClick={() => handleSort("id")}
            ></ion-icon>
          </th>
          <th className={style.th}>
            User ID
            <ion-icon
              name="chevron-down-outline"
              onClick={() => handleSort("userId")}
            ></ion-icon>
          </th>
          <th className={style.th}>
            Status
            <ion-icon
              name="chevron-down-outline"
              onClick={() => handleSort("status")}
            ></ion-icon>
          </th>
          <th className={style.th}>
            Fecha de creacion
            <ion-icon
              name="chevron-down-outline"
              onClick={() => handleSort("createdAt")}
            ></ion-icon>
          </th>
          <th className={style.th}>Details</th>
        </tr>
        {order.count &&
          order.rows.map((order) => (
            <tr className={style.tr}>
              <td className={style.td}>{order.id}</td>
              <td className={style.td}>{order.userId}</td>
              <td className={style.td}>
                {order.status === "procesando" ? (
                  <select
                    name={order.id}
                    id="estado"
                    value={order.status}
                    onChange={handleChange}
                  >
                    <option value="procesando">Procesando</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="completa">Completa</option>
                  </select>
                ) : (
                  order.status
                )}
              </td>
              <td className={style.td}>{order.createdAt}</td>
              <td className={style.td}>
                <button
                  className={style.Btn}
                  onClick={() => push(`/admin/orderDetails/${order.id}`)}
                >
                  Detalles
                </button>
              </td>
            </tr>
          ))}
      </table>
      <button
        className={style.Btn}
        disabled={page === 1 || page === "1"}
        onClick={() => setPage(page - 1)}
      >
        Back
      </button>
      <button
        className={style.Btn}
        disabled={parseInt(page) === pageLimit}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
