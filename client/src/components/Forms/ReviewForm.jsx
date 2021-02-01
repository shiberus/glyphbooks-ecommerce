import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import style from "../../CSS/reviewForm.module.scss";
import axios from "axios";

export default function Review({
  productId,
  userId,
  notShow,
  orderId,
  reviewId,
}) {
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [input, setInput] = useState({
    rating: "",
    title: "",
    body: "",
    userId,
  });

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    if (reviewId) {
      axios
        .put(`${process.env.REACT_APP_API}/reviews/${reviewId}`, input)
        .then((data) => {
          notShow();
        });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API}/reviews/products/${productId}/review`,
          input
        )
        .then((data) => {
          notShow();
        });
    }
    e.preventDefault();
  };

  const ratingChanged = (newRating) => {
    setInput({
      ...input,
      rating: newRating,
    });
  };

  useEffect(() => {
    /*if(!input.title || !input.body) {
      setError("este campo es obligatorio")
      setError2("este campo es obligatorio")
    } if(input.body.length > 255 || input.title.length > 255) {
      setError("puede contener hasta 255 caracteres")
      setError2("puede contener hasta 255 caracteres")
    } else setError(null);*/
    const validate = function (field, set) {
      if (!field) {
        set("este campo es obligatorio");
      } else if (field.length > 255) {
        set("puede contener hasta 255 caracteres");
      } else {
        set(null);
      }
    };
    validate(input.title, setError);
    validate(input.body, setError2);
  }, [input]);

  return (
    <div className={style.container}>
      <div className={style.text}>
        <h1>Qué te pareció el libro?</h1>
      </div>
      <ReactStars
        count={5}
        onChange={ratingChanged}
        size={24}
        activeColor="#ffd700"
      />
      <div className={style.textbox}>
        <input
          type="text"
          value={input.title}
          name="title"
          onChange={handleChange}
          placeholder="Título de tu reseña"
        />
      </div>
      <div className={style.error}>
        {(input.title.length > 255 || !input.title) && <span>{error}</span>}
      </div>
      <div className={style.textbox}>
        <input
          type="text"
          value={input.body}
          name="body"
          onChange={handleChange}
          placeholder="Contanos"
        />
      </div>
      <div className={style.error}>
        {(input.body.length > 255 || !input.body) && <span>{error2}</span>}
      </div>
      <button
        disabled={error || error2 || !input.rating}
        className={style.Btn}
        onClick={handleSubmit}
      >
        Listo
      </button>
    </div>
  );
}
