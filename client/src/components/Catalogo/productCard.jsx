import React from "react";
import { useHistory } from "react-router-dom";
import style from "../../CSS/productCard.module.scss";

export default function Product(props) {
  const { push } = useHistory();

  const descuento = Math.floor(
    props.price - props.price * (props.discount / 100)
  );

  return (
    <div className={style.Producto}>
      <div className={style.Center}>
        <img
          className={style.Libroimg}
          src={props.img}
          alt="imagen del producto"
          onClick={() => push(`/products/${props.id}`)}
        />
        <div className={style.description}>
          <h3 className={style.title}>{props.title}</h3>
          {props.discount ? (
            <div className={style.descuento}>
              <h3>${props.price}</h3>
              <h2 className={style.Price}>${descuento}</h2>
              <h2 className={style.off}>%{props.discount} off</h2>
            </div>
          ) : (
            <h2 className={style.Price}>${props.price}</h2>
          )}
        </div>
        <button
          className={style.Button}
          onClick={() => push(`/products/${props.id}`)}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
