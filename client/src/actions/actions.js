import { LOGIN, LOGOUT } from "../constants/user.constants";
import {
  AGREGAR_CARRITO,
  REMOVER_CARRITO,
  AGREGAR_VARIOS,
  CERRAR_CARRITO,
  BUSCAR_PRODUCTOS,
} from "../constants/cart.constants";

export function login(user) {
  return {
    type: LOGIN,
    user,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function agregarAlCarrito(producto) {
  return {
    type: AGREGAR_CARRITO,
    producto,
  };
}

export function removerCarrito(producto, cantidad) {
  return {
    type: REMOVER_CARRITO,
    producto,
    cantidad,
  };
}

export function agregarVarios(productos) {
  return {
    type: AGREGAR_VARIOS,
    productos,
  };
}

export function cerrarCarrito() {
  return {
    type: CERRAR_CARRITO,
  };
}

export function buscarProductos(productos) {
  return {
    type: BUSCAR_PRODUCTOS,
    productos,
  };
}
