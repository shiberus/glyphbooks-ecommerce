import {
  AGREGAR_CARRITO,
  REMOVER_CARRITO,
  AGREGAR_VARIOS,
  CERRAR_CARRITO,
  BUSCAR_PRODUCTOS,
} from "../constants/cart.constants";

const initialState = {
  productos: [],
  items: [],
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case AGREGAR_CARRITO: {
      var found = false;
      !action.producto.lineOrder &&
        (action.producto.lineOrder = {
          quantity: 1,
          price: action.producto.price,
        });
      var newItems = state.items.map((product) => {
        if (product.id === action.producto.id) {
          if (product.lineOrder.quantity < action.producto.stock) {
            product.lineOrder.quantity++;
          }
          found = true;
        }
        return product;
      });
      if (found === false) {
        return {
          ...state,
          items: [...state.items, action.producto],
        };
      }
      return {
        ...state,
        items: [...newItems],
      };
    }
    case REMOVER_CARRITO: {
      var deleteThis = false;
      var newItems = state.items.map((product) => {
        if (product.id === action.producto.id) {
          if (product.lineOrder.quantity > 1) {
            product.lineOrder.quantity--;
            return product;
          } else {
            deleteThis = true;
          }
        } else return product;
      });
      if (deleteThis === true || action.cantidad === "all") {
        return {
          ...state,
          items: [...state.items.filter((e) => e !== action.producto)],
        };
      }
      return {
        ...state,
        items: [...newItems],
      };
    }

    case AGREGAR_VARIOS: {
      return {
        ...state,
        items: action.productos,
      };
    }

    case CERRAR_CARRITO: {
      return {
        ...state,
        items: [],
      };
    }

    case BUSCAR_PRODUCTOS: {
      return {
        ...state,
        productos: action.productos,
      };
    }

    default:
      return state;
  }
}

export default cartReducer;
