import React, { useEffect, useState } from "react";
import { useSelector, connect } from "react-redux";
import { agregarAlCarrito, agregarVarios } from "../../actions/actions";
import style from "../../CSS/ProductDetail.module.scss";
import axios from "axios";
import Review from "./review";
import ShoppingBagIcon from "../Icons/ShoppingBagIcon";

function Product(props) {
  const [product, setProduct] = useState(null);
  const { user } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);

  const descuento = product?.discount
    ? Math.floor(product.price - product.price * (product.discount / 100))
    : null;

  const agregarCarrito = (producto) => {
    if (user !== "guest") {
      const notNew = items.find((p) => Number(p.id) === Number(producto.id));
      var nextStep;
      if (notNew) {
        if (notNew.stock > notNew.lineOrder.quantity) {
          let { quantity, orderId, id } = notNew.lineOrder;
          let newQuantity = quantity + 1;
          nextStep = axios.put(
            `${process.env.REACT_APP_API}/order/${orderId}/lineorder`,
            {
              id,
              quantity: newQuantity,
            }
          );
        } else {
          return;
        }
      } else {
        let price = descuento ? descuento : producto.price;

        nextStep = axios.post(
          `${process.env.REACT_APP_API}/users/${user.id}/cart`,
          {
            id: producto.id,
            price,
          }
        );
      }
      nextStep
        .then(() => {
          return axios.get(
            `${process.env.REACT_APP_API}/users/${user.id}/cart`
          );
        })
        .then(({ data }) => {
          if (data.length) {
            props.dispatch(agregarVarios(data[0].products));
            props.setShow(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      let price = descuento ? descuento : producto.price;
      props.dispatch(agregarAlCarrito({ ...producto, price }));
      props.setShow(true);
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/products/search/${props.id}`)
      .then(({ data }) => {
        setProduct(data.book);
      });
  }, [props.id]);

  if (product) {
    return (
      <div className={style.container}>
        <div className={style.bkg} />
        <div className={style.details}>
          <section>
            <img
              className={style.img}
              src={product.img}
              alt="imagen del producto"
            />
          </section>
          <section>
            <h1>{product.title}</h1>
            <h2 style={{ paddingBottom: "1rem" }}>{product.author}</h2>
            <p>{product.description}</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "2rem",
              }}
            >
              <button onClick={() => agregarCarrito(product)}>
                <ShoppingBagIcon color="var(--color-primary)" size={24} />
                <span>COMPRAR</span>
                <span>{`$ ${descuento || product.price}`}</span>
              </button>
              <label style={{ marginLeft: "1.5rem" }}>Stock:</label>
              <span style={{ marginLeft: "0.5rem" }}>{product.stock}</span>
            </div>
            <span className={style.rereviews}>
              Reseñas de nuestros usuarios
            </span>
            <div className={style.reviews}>
              {product?.reviews?.length ? (
                product.reviews.map((review, index) => (
                  <Review review={review} key={index} />
                ))
              ) : (
                <div style={{ margin: "0.5rem", color: "var(--color-text)" }}>
                  No hay reseñas disponibles para este producto
                </div>
              )}
            </div>
            {descuento ? (
              <h2 className={style.off}>%{product.discount} OFF</h2>
            ) : null}
          </section>
        </div>
      </div>
    );
  } else {
    return <div>Buscando</div>;
  }
}

export default connect()(Product);
