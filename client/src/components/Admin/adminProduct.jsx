import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../../CSS/Admin/adminProduct.module.scss";
import { useHistory } from "react-router-dom";

export default function AdminProduct({ setProducto }) {
  const { push } = useHistory();
  const [productos, setProductos] = useState([]);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const pageLimit = Math.ceil(productos.count / 12);

  const handleSort = (name) => {
    let newOrder = JSON.stringify([[name, "ASC"]]);
    newOrder === sort && (newOrder = JSON.stringify([[name, "DESC"]]));
    setSort(newOrder);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/products?page=${page}&order=${sort}`)
      .then(({ data }) => {
        setProductos(data);
      });
  }, [page, sort]);
  return (
    <div className={style.size}>
      <div className={style.btns}>
        <button
          className={style.Btn}
          name="crud"
          onClick={() => push("/admin/crud")}
        >
          NUEVO PRODUCTO
        </button>
        <button
          className={style.Btn}
          name="newCategory"
          onClick={() => push("/admin/newCategory")}
        >
          NUEVA CATEGORÍA
        </button>
      </div>
      <table className={style.products}>
        <tr className={style.tr}>
          <th className={style.th}>
            ID
            <ion-icon
              name="chevron-down-outline"
              onClick={() => handleSort("id")}
            ></ion-icon>
          </th>
          <th className={style.th}>
            Titulo
            <ion-icon
              name="chevron-down-outline"
              onClick={() => handleSort("title")}
            ></ion-icon>
          </th>
          <th className={style.th}>
            Autor
            <ion-icon
              name="chevron-down-outline"
              onClick={() => handleSort("author")}
            ></ion-icon>
          </th>
          <th className={style.th}>Descripcion</th>
          <th className={style.th}>
            Precio
            <ion-icon
              name="chevron-down-outline"
              onClick={() => handleSort("price")}
            ></ion-icon>
          </th>
          <th className={style.th}>
            Stock
            <ion-icon
              name="chevron-down-outline"
              onClick={() => handleSort("stock")}
            ></ion-icon>
          </th>
          <th className={style.th}>Editar</th>
        </tr>
        {productos.count &&
          productos.rows.map((product) => (
            <tr className={style.tr}>
              <td className={style.td}>{product.id}</td>
              <td className={style.td}>{product.title}</td>
              <td className={style.td}>{product.author}</td>
              <td className={style.td}>{product.description}</td>
              <td className={style.td}>{product.price}</td>
              <td className={style.td}>{product.stock}</td>
              <td className={style.td}>
                <ion-icon
                  name="create-outline"
                  color="var(--color-primary)"
                  onClick={() => {
                    setProducto(product);
                    push("/admin/crud");
                  }}
                ></ion-icon>
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
