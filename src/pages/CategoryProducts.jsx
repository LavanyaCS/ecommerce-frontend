import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../api";
import toast from "react-hot-toast";

function CategoryProducts() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/product/category/${categoryId}`);
        setProducts(res.data.productInfo || []);
        if (res.data.productInfo.length > 0) {
          setCategory(res.data.productInfo[0].category); // category info is populated
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load category products");
      }
    };
    fetchProducts();
  }, [categoryId]);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">
        {category ? category.title : "Category"} Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.length > 0 ? (
                       products.map((product) => (
             <div key={product._id} className="max-w-xs bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition">
       {/* <!-- Product Image --> */}
     <Link 
                       to={`/product/${product._id}`}
                       >
                         <img className="p-4 rounded-t-lg" src={product.image[0]} alt={product.title} />
     
       {/* <!-- Product Info --> */}
       <div className="px-5 pb-5 text-center">
         <h5 className="text-lg font-semibold text-gray-800">{product.title}</h5>
         <div className="mt-2">
           <span className="text-xl font-bold text-gray-900">{product.price}</span>
           <span className="ml-2 text-sm line-through text-gray-500">{product.quantity}</span>
         </div>
       </div>
     </Link>
       {/* <!-- Action Buttons --> */}
     <div className="grid grid-cols-2 divide-x border-t">
       {/* View Detail */}
       <Link
         to={`/product/${product._id}`}
         className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-blue-600 transition"
       >
         <svg
           xmlns="http://www.w3.org/2000/svg"
           className="w-5 h-5"
           fill="none"
           viewBox="0 0 24 24"
           stroke="currentColor"
         >
           <path
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="2"
             d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
           />
         </svg>
         <span className="text-sm font-medium">View Detail</span>
       </Link>
     
       {/* Add to Cart */}
       <button
         // onClick={() => handleAddToCart(product)} // <-- custom function
         className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-green-600 transition"
       >
         <svg
           xmlns="http://www.w3.org/2000/svg"
           className="w-5 h-5"
           fill="none"
           viewBox="0 0 24 24"
           stroke="currentColor"
         >
           <path
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="2"
             d="M3 3h2l.4 2M7 13h14l-1.5 8H6.1M7 13L5.4 5M7 13l1.6-8m4.4 8v6m4-6v6"
           />
         </svg>
         <span className="text-sm font-medium">Add To Cart</span>
       </button>
     </div>
     
     </div>
     ))
                     ) : (
                       <p className="px-4 py-2 text-gray-500 text-center">No product</p>
                     )}
      </div>
    </div>
  );
}

export default CategoryProducts;
