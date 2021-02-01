import React from "react";
import style from "../../CSS/review.module.scss";
import ReactStars from "react-rating-stars-component";

export default function Review({ review }) {
  return (
    <div className={style.container}>
      <div>
        <h1 className={style.title}>{review.title}</h1>
        <div className={style.rating}>
          <ReactStars
            count={5}
            isHalf={true}
            value={review.rating}
            edit={false}
          />
        </div>
        <h3 className={style.user}>{review.user?.firstName}</h3>
        <h4 className={style.date}>
          {new Date(review.createdAt).toDateString()}
        </h4>
        <h3 className={style.description}>{review.body}</h3>
      </div>
    </div>
  );
}
