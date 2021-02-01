import React, { useEffect, useState } from "react";
//import style from "./CSS/order.module.css";
import Product from "./Catalogo/Product";
import axios from "axios";

export default function Orden({ id }) {
  const [orders, setOrder] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/order/${id}`).then((data) => {
      setOrder(data);
    });

    axios.get(`${process.env.REACT_APP_API}/order/${id}/order`).then((data) => {
      setCurrentOrder(data);
    });
  }, [id]);

  var precioTotal = orders.reduce((total, order) => {
    return total + order.price * order.quantity;
  }, 0);
  if (currentOrder) {
    return (
      <div>
        <div>ESTADO: {currentOrder.status}</div>
        <div>FECHA DE COMPRA: {currentOrder.date}</div>
        <div>NÚMERO DE ORDEN: {this.props.id}</div>
        <div>TOTAL: {precioTotal}</div>
        <Product />
      </div>
    );
  } else {
    return <div>No se halló la orden</div>;
  }
}
