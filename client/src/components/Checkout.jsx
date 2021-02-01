import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { cerrarCarrito } from "../actions/actions";
import OrderDetails from "./Admin/orderDetails.jsx";
import style from "../CSS/checkout.module.scss";

export default function Checkout(props) {
  const [order, setOrder] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [input, setInput] = useState("");
  const { push } = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    setInput(order.user?.shippingAdress);
  }, [order]);

  const handleSubmit = () => {
    axios
      .put(`${process.env.REACT_APP_API}/users/${user.id}`, {
        shippingAdress: input,
      })
      .then(({ data }) => {
        props.setLocalUser({ ...props.localUser, user: data });
        push("/catalogo");
      });
  };

  const handleCart = () => {
    const { orderId } = props.items[0].lineOrder;
    if (user.id) {
      axios
        .put(`${process.env.REACT_APP_API}/users/${user.id}/cart`, {
          orderId,
          status: "procesando",
        })
        .then((res) => {
          if ((res.status = 409)) {
            console.log(res);
          }
        })
        .then(() => {
          dispatch(cerrarCarrito());
        });
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className={style.container}>
      <OrderDetails checkout={setOrder} />
      <div className={style.textbox}>
        <h3>Indica la dirección de envio</h3>
        <input onChange={handleChange} type="text" value={input}></input>
      </div>
      <button
        className={style.btn}
        disabled={!input}
        onClick={() => {
          handleCart();
          handleSubmit();
        }}
      >
        ¡COMPRAR!
      </button>
    </div>
  );
}
