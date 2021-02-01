import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { agregarVarios, login } from "./actions/actions";
import axios from "axios";
// import ReactGA from "react-ga";
import "./App.scss";
import "./normalize.css";
import Footer from "./components/Footer";

//componentes

import NavBar from "./components/NavBar";
import Homepage from "./components/Home";
import Login from "./components/Login.jsx";
import Faq from "./components/Faq";
import Catalogo from "./components/Catalogo/Catalogue";
import Producto from "./components/Catalogo/Product";
import Admin from "./components/Admin/admin";
import Carrito from "./components/Carrito/Carrito.jsx";
import NewUser from "./components/Forms/UserForm.jsx";
import ResetPassword from "./components/ResetPassword";
import Forgot from "./components/Forgot";
import Cuenta from "./components/User/user.jsx";
import Checkout from "./components/Checkout.jsx";

function App(props) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const [localUser, setLocalUser, removeLocalUser] = useLocalStorage(
    "user",
    undefined
  );

  const [carritoLocal, setCarritoLocal] = useLocalStorage("carrito", []);

  useEffect(() => {
    if (localUser) {
      if (localUser.token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${localUser.token}`;
        // ReactGA.set({ userId: localUser.user.id });
      } else {
        axios.defaults.headers.common["Authorization"] = ``;
        // ReactGA.set({ userId: undefined });
      }
    } else {
      axios.defaults.headers.common["Authorization"] = ``;
      // ReactGA.set({ userId: undefined });
    }
    dispatch(login(localUser?.user || "guest"));
  }, [localUser, dispatch]);

  useEffect(() => {
    setCarritoLocal(props.carrito.cart.items);
  }, [props.carrito.cart.items, setCarritoLocal]);

  useEffect(() => {
    if (!localUser) {
      dispatch(agregarVarios(carritoLocal));
    } else {
      let { id: idUser } = localUser.user;
      axios
        .get(`${process.env.REACT_APP_API}/users/${idUser}/cart`)
        .then(({ data }) => {
          if (data[0]) {
            dispatch(agregarVarios(data[0].products));
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(agregarVarios(carritoLocal));
        });
    }
  }, []);

  return (
    <Router>
      <NavBar
        logOut={() => {
          removeLocalUser();
          setCarritoLocal([]);
          dispatch(agregarVarios([]));
        }}
        onCartClick={() => setShow((prevShow) => !prevShow)}
        localUser={localUser}
      />
      <Carrito
        cartShow={show}
        setShow={setShow}
        items={props.carrito.cart.items}
      />
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/catalogo" render={() => <Catalogo />} />
        <Route path="/faq" component={Faq} />
        <Route
          exact
          path="/products/:id"
          render={({ match }) => (
            <Producto id={match.params.id} setShow={setShow} />
          )}
        />
        <Route
          path="/ingresar"
          render={() => <Login setLocalUser={setLocalUser} />}
        />
        <Route
          path="/checkout/:orderId"
          render={() => (
            <Checkout
              setLocalUser={setLocalUser}
              localUser={localUser}
              items={props.carrito.cart.items}
            />
          )}
        />
        <Route path="/admin" component={Admin} />
        <Route path="/signup" component={NewUser} />
        <Route
          exact
          path="/password/:token"
          render={({ match }) => <ResetPassword token={match.params.token} />}
        />
        <Route path="/forgot" component={Forgot} />
        <Route
          path="/cuenta"
          render={() => (
            <Cuenta
              setLocalUser={setLocalUser}
              localUser={localUser}
              logOut={() => {
                removeLocalUser();
                setCarritoLocal([]);
                dispatch(agregarVarios([]));
              }}
            />
          )}
        />
      </Switch>
      <Footer />
    </Router>
  );
}

const mapStateToProps = (state) => {
  return {
    carrito: state,
  };
};

export default connect(mapStateToProps)(App);
