import React from "react";
import { useHistory } from "react-router-dom";
import style from "../../CSS/pagination.module.scss";

export default function Pagination({ page = 1, quantity, rows }) {
  const { push } = useHistory();
  const pageLimit = Math.ceil(quantity / 12);
  return (
    <div className={style.Pagination}>
      <button
        className={style.Button}
        disabled={page === 1 || page === "1"}
        onClick={() => push(`/catalogo?page=${--page}`)}
      >
        Back
      </button>
      <h1>{page}</h1>
      <button
        disabled={parseInt(page) === pageLimit || rows < 12}
        className={style.Button}
        onClick={() => push(`/catalogo?page=${++page}`)}
      >
        Next
      </button>
    </div>
  );
}
