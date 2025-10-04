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
        setProducts(res.data.products || []);
        if (res.data.products.length > 0) {
          setCategory(res.data.products[0].category); // category info is populated
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load category products");
      }
    };
    fetchProducts();
  }, [categoryId]);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">
        {category ? category.title : "Category"} Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.length > 0 ? (
                       products.map((product) => (
             <div key={product._id} className="max-w-xs bg-white border border-gray-200 hover:border-blue-200 rounded-lg shadow hover:shadow-lg transition">
    <Link to={`/product/${product._id}`}>
      <img
        className="p-4 rounded-t-lg"
        src={product.image?.[0] || "/placeholder.png"}
        alt={product.title}
      />
      <div className="px-5 pb-5 text-center">
        <h5 className="text-lg font-semibold text-gray-800">{product.title}</h5>
        <div className="mt-2">
          <span className="text-xl font-bold text-gray-900">{product.price}</span>
          <span className="ml-2 text-sm line-through text-gray-500">{product.quantity}</span>
        </div>
      </div>
    </Link>
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
