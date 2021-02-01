import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import style from "../../CSS/crudform.module.scss";
import AddCategory from "./CategorySelector";

export default function CrudProducts({ product, setProduct }) {
  const [input, setInput] = useState({
    title: "",
    description: "",
    author: "",
    price: 1,
    discount: 0,
    stock: 1,
    img: null,
  });

  const [error, setError] = useState("este campo es obligatorio");

  const { push } = useHistory();

  useEffect(() => {
    if (product) {
      setInput(product);
    }
  }, [product]);

  useEffect(() => {
    if (
      !input.title ||
      !input.author ||
      !input.price ||
      (!input.stock && input.stock !== 0)
    ) {
      setError("este campo es obligatorio");
    } else {
      setError(null);
    }
  }, [input, setError]);

  const handleChange = (e) => {
    if (
      e.target.name === "discount" &&
      (e.target.value > 100 || e.target.value < 0)
    ) {
      return;
    }
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    let discount = !input.discount ? 0 : input.discount;
    if (!product) {
      axios
        .post(`${process.env.REACT_APP_API}/products`, { ...input, discount })
        .then(({ data }) => {
          setProduct(data);
        });

      e.preventDefault();
    } else {
      axios
        .put(`${process.env.REACT_APP_API}/products/${product.id}`, input)
        .then(({ data }) => {
          console.log(data);
          setInput(data);
        });

      e.preventDefault();
    }
  };

  const handleDelete = () => {
    if (product) {
      axios
        .delete(`${process.env.REACT_APP_API}/products/${product.id}`)
        .then(() => {
          setProduct(null);
          push("/admin/products");
        });
    } else {
      push("/admin/products");
    }
  };

  return (
    <div className={style.fondo}>
      <form onSubmit={handleSubmit} className={style.form}>
        <h1>CREAR O MODIFICAR PRODUCTO</h1>
        <div className={style.textbox}>
          <input
            placeholder="Titulo"
            type="text"
            value={input.title}
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className={style.error}>
          {!input.title && <span>{error}</span>}
        </div>
        <div>
          <textarea
            className={style.textarea}
            rows={5}
            placeholder="Descripcion (máximo mil caracteres)"
            value={input.description}
            name="description"
            onChange={handleChange}
            maxLength={1000}
          />
        </div>
        <div className={style.textbox}>
          <input
            placeholder="Autor"
            type="text"
            value={input.author}
            name="author"
            onChange={handleChange}
          />
        </div>
        <div className={style.error}>
          {!input.author && <span>{error}</span>}
        </div>
        <div className={style.textbox}>
          <input
            placeholder="Precio"
            type="number"
            value={input.price}
            name="price"
            onChange={handleChange}
          />
        </div>
        <div className={style.error}>
          {!input.price && <span>{error}</span>}
        </div>
        <div className={style.textbox}>
          <input
            placeholder="Stock"
            type="number"
            value={input.stock}
            name="stock"
            onChange={handleChange}
          />
        </div>
        <div className={style.error}>
          {!input.stock && input.stock !== 0 && <span>{error}</span>}
        </div>
        <div className={style.textbox}>
          <input
            placeholder="Imagen"
            type="text"
            value={input.img}
            name="img"
            onChange={handleChange}
          />
        </div>
        <div className={style.textbox}>
          <h4>Agregar descuento? (ingrese el porcentaje)</h4>
          <input
            placeholder="Descuento"
            type="number"
            value={input.discount}
            name="discount"
            onChange={handleChange}
          />
        </div>
        <div className={style.btnDiv}>
          {!error && (
            <input className={style.btn} type="submit" value="AGREGAR" />
          )}
          <button className={style.btn} onClick={handleDelete}>
            ELIMINAR
          </button>
        </div>
        {!product ? null : (
          <AddCategory producto={product} setProducto={setProduct} />
        )}
      </form>
    </div>
  );
}
