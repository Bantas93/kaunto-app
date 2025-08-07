// app/components/ProductContext.js
"use client";
import {
  getAllData,
  getProducts,
  getProductsOption,
} from "../lib/data-service";

const { createContext, useState, useEffect, useContext } = require("react");

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [stats, setStats] = useState();
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllData();
        setStats(data[0]);
        const x = await getProductsOption();
        setProducts(x);
        const i = await getProducts();
        setItems(i);
        setIsLoading(false);
      } catch (err) {
        throw new Error("Gagal mengambil data product", err);
      }
    };
    fetchData();
  }, []);

  const refreshProducts = async () => {
    setIsLoading(true);
    const updatedItems = await getProducts();
    setItems(updatedItems);
    setIsLoading(false);
  };

  return (
    <ProductContext.Provider
      value={{ stats, products, isLoading, items, refreshProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
