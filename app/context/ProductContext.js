"use client";
import { createContext, useState, useEffect, useContext } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [stats, setStats] = useState();
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = "/api/product"; // endpoint Next.js API (bisa juga pakai Supabase REST URL)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // GET semua data statistik
        const statsRes = await fetch(`${API_BASE}/stats`);
        const statsData = await statsRes.json();
        setStats(statsData);

        // GET produk untuk dropdown
        const optionRes = await fetch(`${API_BASE}/options`);
        const optionData = await optionRes.json();
        setProducts(optionData);

        // GET daftar produk lengkap
        const itemsRes = await fetch(`${API_BASE}/list`);
        const itemsData = await itemsRes.json();
        setItems(itemsData);

        setIsLoading(false);
      } catch (err) {
        console.error("Gagal mengambil data product", err);
      }
    };
    fetchData();
  }, []);

  const refreshProducts = async () => {
    setIsLoading(true);
    const itemsRes = await fetch(`${API_BASE}/list`);
    const itemsData = await itemsRes.json();
    setItems(itemsData);
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
