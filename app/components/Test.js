// UNTUK TEST2 TEMPLATE
const Test = () => {
  // // Form
  // return (
  //   <div className="bg-white border rounded-lg shadow relative m-10">
  //     <div className="flex items-start justify-between p-5 rounded-t">
  //       <h3 className="text-xl font-semibold">Edit product</h3>
  //     </div>
  //     <div className="p-6 space-y-6">
  //       <form action="#">
  //         <div className="grid grid-cols-6 gap-6">
  //           <div className="col-span-6 sm:col-span-3">
  //             <label
  //               htmlFor="product-name"
  //               className="text-sm font-medium text-gray-900 block mb-2"
  //             >
  //               Product Name
  //             </label>
  //             <input
  //               type="text"
  //               name="product-name"
  //               id="product-name"
  //               className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
  //               placeholder="Apple Imac 27”"
  //               required=""
  //             />
  //           </div>
  //           <div className="col-span-6 sm:col-span-3">
  //             <label
  //               htmlFor="category"
  //               className="text-sm font-medium text-gray-900 block mb-2"
  //             >
  //               Category
  //             </label>
  //             <input
  //               type="text"
  //               name="category"
  //               id="category"
  //               className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
  //               placeholder="Electronics"
  //               required=""
  //             />
  //           </div>
  //           <div className="col-span-6 sm:col-span-3">
  //             <label
  //               htmlFor="brand"
  //               className="text-sm font-medium text-gray-900 block mb-2"
  //             >
  //               Brand
  //             </label>
  //             <input
  //               type="text"
  //               name="brand"
  //               id="brand"
  //               className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
  //               placeholder="Apple"
  //               required=""
  //             />
  //           </div>
  //           <div className="col-span-6 sm:col-span-3">
  //             <label
  //               htmlFor="price"
  //               className="text-sm font-medium text-gray-900 block mb-2"
  //             >
  //               Price
  //             </label>
  //             <input
  //               type="number"
  //               name="price"
  //               id="price"
  //               className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
  //               placeholder="$2300"
  //               required=""
  //             />
  //           </div>
  //           <div className="col-span-full">
  //             <label
  //               htmlFor="product-details"
  //               className="text-sm font-medium text-gray-900 block mb-2"
  //             >
  //               Product Details
  //             </label>
  //             <textarea
  //               id="product-details"
  //               rows="6"
  //               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
  //               placeholder="Details"
  //             ></textarea>
  //           </div>
  //         </div>
  //       </form>
  //     </div>
  //     <div className="p-6 border-t border-gray-200 rounded-b">
  //       <button
  //         className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
  //         type="submit"
  //       >
  //         Save all
  //       </button>
  //     </div>
  //   </div>
  // );
  // return (
  //   <div className="relative  w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
  //     <a className="relative  flex h-60 overflow-hidden rounded-xl" href="#">
  //       <img
  //         className="object-cover"
  //         src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
  //         alt="product image"
  //       />
  //       <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
  //         39% OFF
  //       </span>
  //     </a>
  //     <div className="mt-4 px-5 pb-5">
  //       <a href="#">
  //         <h5 className="text-xl tracking-tight text-slate-900">
  //           Nike Air MX Super 2500 - Red
  //         </h5>
  //       </a>
  //       <div className="mt-2 mb-5 flex items-center justify-between">
  //         <p>
  //           <span className="text-3xl font-bold text-slate-900">$449</span>
  //           <span className="text-sm text-slate-900 line-through">$699</span>
  //         </p>
  //         <div className="flex items-center">
  //           <svg
  //             aria-hidden="true"
  //             className="h-5 w-5 text-yellow-300"
  //             fill="currentColor"
  //             viewBox="0 0 20 20"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  //           </svg>
  //           <svg
  //             aria-hidden="true"
  //             className="h-5 w-5 text-yellow-300"
  //             fill="currentColor"
  //             viewBox="0 0 20 20"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  //           </svg>
  //           <svg
  //             aria-hidden="true"
  //             className="h-5 w-5 text-yellow-300"
  //             fill="currentColor"
  //             viewBox="0 0 20 20"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  //           </svg>
  //           <svg
  //             aria-hidden="true"
  //             className="h-5 w-5 text-yellow-300"
  //             fill="currentColor"
  //             viewBox="0 0 20 20"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  //           </svg>
  //           <svg
  //             aria-hidden="true"
  //             className="h-5 w-5 text-yellow-300"
  //             fill="currentColor"
  //             viewBox="0 0 20 20"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  //           </svg>
  //           <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
  //             5.0
  //           </span>
  //         </div>
  //       </div>
  //       <a
  //         href="#"
  //         className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
  //       >
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           className="mr-2 h-6 w-6"
  //           fill="none"
  //           viewBox="0 0 24 24"
  //           stroke="currentColor"
  //           strokeWidth={2}
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
  //           />
  //         </svg>
  //         Add to cart
  //       </a>
  //     </div>
  //   </div>
  // );
};

export default Test;
