import { createContext, useContext, useReducer, useEffect } from "react"

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find((it) => it.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((it) =>
            it.id === action.payload.id ? { ...it, quantity: it.quantity + 1 } : it
          ),
        };
      }
      return { ...state, items: [...state.items, sanitizeItem({ ...action.payload, quantity: 1 })] };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_QUANTITY": {
      const q = Number(action.payload.quantity);
      const quantity = Number.isFinite(q) && q > 0 ? q : 1;
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload.id ? { ...it, quantity } : it
        ),
      };
    }   

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }

    case "LOAD_CART": {
      const loaded = Array.isArray(action.payload) ? action.payload.map(sanitizeItem) : [];
      return { ...state, items: loaded };
    }

    default:
      return state
  }
}
// Normaliza precio que puede venir como "$1.299" o 1299
function toNumberPrice(val) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const clean = val.replace(/[^\d,.-]/g, "");
    const normalized = clean.replace(/\./g, "").replace(/,/g, ".");
    const n = parseFloat(normalized);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function sanitizeItem(raw) {
  const qty = Number(raw?.quantity);
  return {
    ...raw,
    price: toNumberPrice(raw?.price),
    quantity: Number.isFinite(qty) && qty > 0 ? qty : 1,
  };
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) })
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product })
  }

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce(
      (acc, item) =>
      acc + toNumberPrice(item?.price) * (item?.quantity || 0),
      0
    );
  };


  

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider")
  }
  return context
}
