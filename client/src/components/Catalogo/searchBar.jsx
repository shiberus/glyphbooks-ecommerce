import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import style from "../../CSS/searchBar.module.scss";
import { buscarProductos } from "../../actions/actions";

export default function SearchBar() {
  const [book, setBook] = useState("");

  const dispatch = useDispatch();
  const { push } = useHistory();

  const onSearch = (book) => {
    if (book.length) {
      dispatch(buscarProductos(book));
      setBook("");
      push("/catalogo");
    }
  };

  return (
    <form
      className={style.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(book);
      }}
    >
      <input
        className={style.input}
        type="text"
        placeholder="Autor, título, descripción..."
        value={book}
        onChange={(e) => setBook(e.target.value)}
      />
    </form>
  );
}

// Las lineas comentadas son parametros y funciones a utilizar o realizar mas adelante
