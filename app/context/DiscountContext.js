// app/components/ProductContext.js
"use client";

import {
  getProductsOption,
  getProductsWithDiscount,
} from "../lib/data-service";

const { createContext, useState, useEffect, useContext } = require("react");

const DiscountContext = createContext();

export const DiscountProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductsOption();
        setProducts(data);
        const i = await getProductsWithDiscount();
        setItems(i);
        setIsLoading(false);
      } catch (err) {
        throw new Error("Gagal mengambil data diskon", err);
      }
    };
    fetchData();
  }, []);

  const refreshProductDiscount = async () => {
    setIsLoading(true);
    const updatedItems = await getProductsWithDiscount();
    setItems(updatedItems);
    setIsLoading(false);
  };

  return (
    <DiscountContext.Provider
      value={{ isLoading, items, products, refreshProductDiscount }}
    >
      {children}
    </DiscountContext.Provider>
  );
};

export const useDiscount = () => useContext(DiscountContext);
