import React, { useEffect, useState } from "react";
import style from "../CSS/homepage.module.scss";
import axios from "axios";
import Producto from "./Catalogo/productCard";
import { useHistory } from "react-router-dom";
import banner from "../template/Images/banner.jpg";

export default function Homepage() {
  const [news, setNews] = useState([]);
  const [sales, setSales] = useState([]);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [third, setThird] = useState(null);
  const { push } = useHistory();

  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  useEffect(() => {
    const order = JSON.stringify([["id", "DESC"]]);
    axios

      .get(
        `${process.env.REACT_APP_API}/products?order=${order}&limit=15&oferta=2`
      )

      .then(({ data }) => {
        setNews(data.rows.splice(3));
        setFirst(data.rows[0]);
        setSecond(data.rows[1]);
        setThird(data.rows[2]);
      });

    axios
      .get(
        `${process.env.REACT_APP_API}/products?order=${order}&limit=12&oferta=1`
      )

      .then(({ data }) => {
        setSales(data.rows);
      });
  }, []);
  return (
    <div className={style.home}>
      <div className={style.page}>
        <div className={style.banner}>
          <blockquote>
            La lectura de un buen libro es un diálogo incesante en que el libro
            habla y el alma contesta
          </blockquote>
          <h4> André Maurois </h4>
          <img className={style.imgn} src={banner} alt="banner" />
        </div>
        <div className={style.imgLibros}>
          <div className={style.content}>
            <section>
              {first && (
                <img className={style.img} src={first.img} alt="ta roto" />
              )}
            </section>
            <section>
              {first ? (
                first.title.length < 20 ? (
                  <h1>{first.title}</h1>
                ) : (
                  <h2 className={style.largeTitle}>
                    {truncateString(first.title, 100)} <hr></hr>
                  </h2>
                )
              ) : null}
              <p>{first ? truncateString(first.description, 265) : null}</p>
              <button onClick={() => push(`/products/${first?.id}`)}>
                Ver más
              </button>
            </section>
            <span className={style.nuevo}>nuevo</span>
          </div>
          <div className={style.content2}>
            <section>
              {second && (
                <img className={style.img} src={second.img} alt="ta roto" />
              )}
            </section>
            <section>
              {second ? (
                second.title.length < 20 ? (
                  <h1>{second.title}</h1>
                ) : (
                  <h2 className={style.largeTitle}>
                    {truncateString(second.title, 100)} <hr></hr>
                  </h2>
                )
              ) : null}
              <p>{second ? truncateString(second.description, 265) : null}</p>
              <button onClick={() => push(`/products/${second?.id}`)}>
                Ver más
              </button>
            </section>
            <span className={style.nuevo}>nuevo</span>
          </div>
        </div>
      </div>
      <div className={style.titulo}>
        <h1>Añadidos recientemente</h1>
      </div>
      <div className={style.fondo}>
        {news.length &&
          news.map((producto) => {
            return (
              <Producto
                img={producto.img}
                title={producto.title}
                price={producto.price}
                key={producto.id}
                id={producto.id}
                OnClick={() => push(`/productos/${producto.id}`)}
                categories={producto.Categories}
              />
            );
          })}
      </div>
      <div className={style.contcont}>
        <div className={style.content3}>
          <section>
            {third && (
              <img className={style.img} src={third.img} alt="ta roto" />
            )}
          </section>
          <section>
            {third ? (
              third.title.length < 20 ? (
                <h1>{third.title}</h1>
              ) : (
                <h2 className={style.largeTitle}>
                  {truncateString(third.title, 100)} <hr></hr>
                </h2>
              )
            ) : null}
            <p>{third ? truncateString(third.description, 265) : null}</p>
            <button onClick={() => push(`/products/${third?.id}`)}>
              Ver más
            </button>
          </section>
          <span className={style.nuevo}>nuevo</span>
        </div>
      </div>
      <div className={style.titulo}>
        <h1>Ofertas</h1>
      </div>
      <div className={style.fondo}>
        {sales.length &&
          sales.map((producto) => {
            return (
              <Producto
                img={producto.img}
                title={producto.title}
                price={producto.price}
                key={producto.id}
                id={producto.id}
                OnClick={() => push(`/productos/${producto.id}`)}
                categories={producto.Categories}
                discount={producto.discount}
              />
            );
          })}
      </div>
    </div>
  );
}
