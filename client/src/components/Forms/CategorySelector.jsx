import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import style from "../../CSS/addCategory.module.scss";

export default function AddCategory({ producto, setProducto }) {
  const [categorias, setCategorias] = useState([]);
  const [selected, setSelected] = useState(1);

  const { push } = useHistory();

  useEffect(() => {
    if (!producto) push("/catalogo");
    axios.get(`${process.env.REACT_APP_API}/category`).then(({ data }) => {
      setCategorias(data);
      setCategorias((oldCategories) =>
        oldCategories.filter((c) => {
          return (
            !producto.Categories ||
            !producto.Categories.find((C) => C.id === c.id)
          );
        })
      );
      if (data.length) {
        setSelected(data[0].id);
      }
    });

    return () => setProducto(null);
  }, [push, producto, setProducto]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(
        `${process.env.REACT_APP_API}/products/category/${producto.id}/${selected}`
      )
      .then(() => {
        setCategorias((oldCategories) =>
          oldCategories.filter((c) => {
            return c.id !== selected;
          })
        );
        setSelected(categorias[0].id);
      });
  };

  const handleChange = (e) => {
    console.log(e.target);
    setSelected(Number(e.target.value));
  };
  return (
    <div className={style.container}>
      <form onSubmit={handleSubmit}>
        <h1>Agregar categorias al producto</h1>
        <div className={style.category}>
          <select onChange={handleChange}>
            {categorias.length &&
              categorias.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
          <input type="submit" value="Agregar" />{" "}
          <button onClick={() => push("/admin/products")}>Finalizar</button>
        </div>
      </form>
    </div>
  );
}
