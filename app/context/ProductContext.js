// // context/ProductContext.js

// "use client";
// import { createContext, useState, useEffect, useContext } from "react";

// const ProductContext = createContext();

// export const ProductProvider = ({ children }) => {
//   const [stats, setStats] = useState();
//   const [products, setProducts] = useState([]);
//   const [items, setItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const API_BASE = "/api/product"; // endpoint Next.js API (bisa juga pakai Supabase REST URL)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // GET semua data statistik
//         const statsRes = await fetch(`${API_BASE}/stats`);
//         const statsData = await statsRes.json();
//         setStats(statsData);

//         // GET produk untuk dropdown
//         const optionRes = await fetch(`${API_BASE}/options`);
//         const optionData = await optionRes.json();
//         setProducts(optionData);

//         // GET daftar produk lengkap
//         const itemsRes = await fetch(`${API_BASE}/list`);
//         const itemsData = await itemsRes.json();
//         setItems(itemsData);

//         setIsLoading(false);
//       } catch (err) {
//         console.error("Gagal mengambil data product", err);
//       }
//     };
//     fetchData();
//   }, []);

//   const refreshProducts = async () => {
//     setIsLoading(true);
//     const itemsRes = await fetch(`${API_BASE}/list`);
//     const itemsData = await itemsRes.json();
//     setItems(itemsData);
//     setIsLoading(false);
//   };

//   const refreshStats = async (customStartDate = null, customEndDate = null) => {
//     try {
//       const data = await getAllData(customStartDate, customEndDate);
//       setStats(data[0]);
//     } catch (error) {
//       console.error("Error refreshing stats:", error);
//     }
//   };

//   // console.log("products = ", products);
//   // console.log("items = ", items);
//   // console.log("stats = ", stats);
//   return (
//     <ProductContext.Provider
//       value={{
//         stats,
//         products,
//         isLoading,
//         items,
//         refreshProducts,
//         refreshStats,
//       }}
//     >
//       {children}
//     </ProductContext.Provider>
//   );
// };

// export const useProducts = () => useContext(ProductContext);

// context/ProductContext.js

"use client";
import { createContext, useState, useEffect, useContext } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [stats, setStats] = useState();
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = "/api/product"; // endpoint Next.js API

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

  // FIXED: refreshStats should call API, not import getAllData directly
  const refreshStats = async (customStartDate = null, customEndDate = null) => {
    try {
      console.log("refreshStats called with:", {
        customStartDate,
        customEndDate,
      });

      // Build URL with query parameters if dates are provided
      let url = `${API_BASE}/stats`;
      if (customStartDate && customEndDate) {
        const params = new URLSearchParams({
          startDate: customStartDate,
          endDate: customEndDate,
        });
        url += `?${params.toString()}`;
      }

      console.log("Fetching from URL:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);

      setStats(data);
    } catch (error) {
      console.error("Error refreshing stats:", error);
    }
  };

  // console.log("products = ", products);
  // console.log("items = ", items);
  // console.log("stats = ", stats);

  return (
    <ProductContext.Provider
      value={{
        stats,
        products,
        isLoading,
        items,
        refreshProducts,
        refreshStats,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
