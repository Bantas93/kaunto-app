// app/context/TransactionContext.js
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { getProducts } from "../lib/data-service";

const TransactionContext = createContext();

const initialState = {
  transactionList: [],
  finalTransaction: null,
  productList: [],
  isLoading: false,
};

function transactionReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_PRODUCTS":
      return { ...state, productList: action.payload };

    case "ADD_TRANSACTION": {
      const existingIndex = state.transactionList.findIndex(
        (item) => item.product_id === action.payload.product_id
      );

      if (existingIndex !== -1) {
        const updatedList = [...state.transactionList];
        updatedList[existingIndex].quantity += 1;
        return { ...state, transactionList: updatedList };
      } else {
        return {
          ...state,
          transactionList: [
            ...state.transactionList,
            { ...action.payload, quantity: 1 },
          ],
        };
      }
    }

    case "REMOVE_SINGLE_TRANSACTION": {
      const existingIndex = state.transactionList.findIndex(
        (item) => item.product_id === action.payload
      );

      if (existingIndex !== -1) {
        const updatedList = [...state.transactionList];
        updatedList[existingIndex].quantity -= 1;

        if (updatedList[existingIndex].quantity <= 0) {
          updatedList.splice(existingIndex, 1);
        }

        return { ...state, transactionList: updatedList };
      }

      return state;
    }

    case "REMOVE_TRANSACTION_BY_NAME":
      return {
        ...state,
        transactionList: state.transactionList.filter(
          (item) => item.name !== action.payload
        ),
      };

    case "SET_FINAL_TRANSACTION":
      return { ...state, finalTransaction: action.payload };

    case "CLEAR_TRANSACTION":
      return { ...state, transactionList: [], finalTransaction: null };

    default:
      return state;
  }
}

export function TransactionProvider({ children }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    getProducts()
      .then((data) => dispatch({ type: "SET_PRODUCTS", payload: data }))
      .finally(() => {
        dispatch({ type: "SET_LOADING", payload: false });
      });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      addToTransaction: (product) => {
        // console.log("Menambahkan produk:", product.name);
        const hasDiscount =
          product.discount_amount && product.discount_amount > 0;
        const price = hasDiscount
          ? product.original_price - product.discount_amount
          : product.price;

        dispatch({
          type: "ADD_TRANSACTION",
          payload: {
            ...product,
            price,
            original_price: hasDiscount ? product.original_price : null,
            discount_amount: hasDiscount ? product.discount_amount : null,
          },
        });
      },

      removeTransactionByName: (name) =>
        dispatch({ type: "REMOVE_TRANSACTION_BY_NAME", payload: name }),
      setFinalTransaction: (payload) =>
        dispatch({ type: "SET_FINAL_TRANSACTION", payload }),
      removeSingleTransaction: (product_id) =>
        dispatch({ type: "REMOVE_SINGLE_TRANSACTION", payload: product_id }),
      clearTransaction: () => dispatch({ type: "CLEAR_TRANSACTION" }),
    }),
    [state]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  return useContext(TransactionContext);
}
