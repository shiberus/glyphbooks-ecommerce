import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Producto from "./productCard.jsx";
import Pagination from "./pagination.jsx";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router";
import { connect, useSelector } from "react-redux";
import style from "../../CSS/catalogue.module.scss";
import axios from "axios";
import SortBar from "./sortBar";

function useQuery() {
  let search = useLocation().search;
  let result = search.slice(1).split("&");
  result = result.reduce((dataResult, item) => {
    const pair = item.split("=");
    dataResult[pair[0]] = pair[1];
    return dataResult;
  }, {});
  return result;
}

function Catalogue(props) {
  const { push } = useHistory();
  const [productos, setProductos] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const { page } = useQuery();

  const searched = useSelector((state) => state.cart.productos);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API}/products?page=${
          page || 1
        }&category=${category}&search=${searched}&order=${sort}&stock=${true}`
      )
      .then(({ data }) => {
        setProductos(data);
      })
      .catch((err) => console.log(err));
  }, [page, category, searched, sort]);

  return (
    <div className={style.Fondo}>
      <Sidebar className={style.Sidebar} setCategory={setCategory} />
      <div className={style.Orden}>
        <SortBar setSort={setSort} sort={sort} className={style.sortBar} />
        <div className={style.Catalogue}>
          {productos.count &&
            productos.rows.map((producto) => {
              if (producto.stock) {
                return (
                  <Producto
                    img={producto.img}
                    title={producto.title}
                    price={producto.price}
                    key={producto.id}
                    id={producto.id}
                    discount={producto.discount}
                    OnClick={() => push(`/productos/${producto.id}`)}
                    categories={producto.Categories}
                  />
                );
              }
              return null;
            })}
        </div>
        {category >= 0 ? (
          <Pagination
            page={page}
            quantity={productos.count}
            rows={productos.rows?.length || 1}
          />
        ) : null}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    estado: state,
  };
};

export default connect(mapStateToProps)(Catalogue);
