import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "../../api";
import { ChevronLeft, ChevronRight } from "lucide-react";

function NewProduct() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const sliderRef = useRef(null);

  // Fetch only 5 latest products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/product?sortBy=createdAt&order=desc&limit=5`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add to Cart
  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${baseUrl}/cart`,
        { product: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to add to cart");
    }
  };

  // Slider Navigation
  const scrollNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320 * 3, behavior: "smooth" }); // scroll 3 cards
    }
  };

  const scrollPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320 * 3, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 relative">
      <h2 className="text-2xl text-left font-semibold py-6">New Products</h2>

      {/* Prev Button */}
      <button
        onClick={scrollPrev}
        className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white shadow-md border rounded-full p-2 hover:bg-gray-100 z-10"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Slider */}
      <div ref={sliderRef} className="overflow-x-auto scroll-smooth no-scrollbar">
        <div className="flex gap-6 min-w-max">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="w-80 flex-shrink-0 bg-white border border-gray-200 hover:border-blue-200 rounded-lg shadow hover:shadow-lg transition"
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    className="p-4 rounded-t-lg h-64 w-full object-cover"
                    src={Array.isArray(product.image) ? product.image[0] : product.image || "/placeholder.png"}
                    alt={product.title}
                  />
                  <div className="px-5 pb-5 text-center">
                    <h5 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h5>
                    <div className="mt-2">
                      <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                    </div>
                  </div>
                </Link>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 divide-x border-t">
                  <Link
                    to={`/product/${product._id}`}
                    className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-blue-600 transition"
                  >
                    View Detail
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-green-600 transition"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-2 text-gray-500 text-center">No products found</p>
          )}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={scrollNext}
        className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white shadow-md border rounded-full p-2 hover:bg-gray-100 z-10"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

export default NewProduct;
