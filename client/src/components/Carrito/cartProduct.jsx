import React from "react";
import { agregarAlCarrito, removerCarrito } from "../../actions/actions";
import { connect } from "react-redux";
import style from "../../CSS/cartProduct.module.scss";
import axios from "axios";

function CartProduct(props) {
  const { quantity } = props.producto.lineOrder;
  const handleChange = (num) => {
    let handler = () => {
      if (num === 1) {
        props.dispatch(agregarAlCarrito(props.producto));
      } else {
        props.dispatch(removerCarrito(props.producto, 1));
      }
    };
    if (props.user !== "guest") {
      let { orderId, id } = props.producto.lineOrder;
      axios
        .put(`${process.env.REACT_APP_API}/order/${orderId}/lineorder`, {
          id: id,
          quantity: quantity + num,
        })
        .then(() => handler());
    } else {
      handler();
    }
  };

  const handleDelete = () => {
    if (props.user !== "guest") {
      let { orderId } = props.producto.lineOrder;
      axios
        .delete(
          `${process.env.REACT_APP_API}/order/${orderId}/lineorder/${props.producto.id}`
        )
        .then(() => {
          props.dispatch(removerCarrito(props.producto, "all"));
        });
    } else props.dispatch(removerCarrito(props.producto, "all"));
  };
  return (
    <div className={style.container}>
      <img className={style.img} src={props.img} alt="imagen del producto" />
      <div className={style.textContainer}>
        <h3 className={style.title}>{props.title}</h3>
        <h3 className={style.price}>$ {props.price}</h3>
        <div className={style.btnContainer}>
          <button
            className={style.btn}
            onClick={() => {
              if (quantity > 1) {
                handleChange(-1);
              } else {
                handleDelete();
              }
            }}
          >
            -
          </button>
          <h3 className={style.quantity}>{quantity}</h3>
          <button
            className={style.btn}
            onClick={() => {
              if (props.producto.stock > quantity) {
                handleChange(1);
              }
            }}
          >
            +
          </button>
        </div>
        <button className={style.btnX} onClick={handleDelete}>
          x
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    carrito: state.cart.items,
    user: state.user.user,
  };
};

export default connect(mapStateToProps)(CartProduct);
