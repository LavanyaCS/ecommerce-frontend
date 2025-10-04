import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../api";
import ReactStars from "react-stars";
import toast from "react-hot-toast";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${baseUrl}/product/${id}`);
        setProduct(res.data.products);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${baseUrl}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const exists = res.data.wishlist.some((item) => item.product._id === id);
        setInWishlist(exists);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWishlist();
  }, [id, token]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${baseUrl}/review`, { params: { productId: id } });
        const allReviews = res.data.reviews || [];
        setReviews(allReviews);

        if (token) {
          const userId = JSON.parse(atob(token.split(".")[1])).id;
          const currentUserReview = allReviews.find((r) => r.user._id === userId);
          if (currentUserReview) {
            setUserReview(currentUserReview);
            setRating(currentUserReview.rating);
            setComment(currentUserReview.comment);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [id, token]);

  // Wishlist toggle
  const toggleWishlist = async () => {
    if (!token) {
      toast.error("Please login to use wishlist");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        `${baseUrl}/wishlist/toggle`,
        { product: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInWishlist(!res.data.removed);
      toast.success(res.data.removed ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong with wishlist");
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        `${baseUrl}/cart/`,
        { product: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart");
      console.log("Cart:", res.data.cart);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  // Submit or update review
  const handleReviewSubmit = async () => {
    if (!token) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }

    try {
      if (userReview) {
        // Edit existing review
        const res = await axios.put(
          `${baseUrl}/review/${userReview._id}`,
          { rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews((prev) =>
          prev.map((r) => (r._id === userReview._id ? res.data.review : r))
        );
        setUserReview(res.data.review);
        toast.success("Review updated successfully");
      } else {
        // Add new review
        const res = await axios.post(
          `${baseUrl}/review`,
          { product: id, rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews([res.data.review, ...reviews]);
        setUserReview(res.data.review);
        toast.success("Review added successfully");
      }

      setEditingReviewId(null);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    }
  };

  // Delete review
  const handleDeleteReview = async () => {
    if (!userReview) return;
    try {
      await axios.delete(`${baseUrl}/review/${userReview._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r._id !== userReview._id));
      setUserReview(null);
      setEditingReviewId(null);
      setComment("");
      setRating(5);
      toast.success("Review deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={Array.isArray(product.image) ? product.image[0] : product.image}
          alt={product.title}
          className="rounded-lg shadow w-full"
        />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="text-red-500 font-semibold text-xl">${product.price}</p>
          <p>{product.description}</p>

            {/* <p>Total quantity : {product.quantity}</p> */}

          <div className="flex gap-4 items-center">
                        <p className="font-semibold">Quantity:</p>
            <input
              type="number"
              value={quantity}
              min={1}
              className="border px-2 py-1 w-16"
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="cursor-pointer px-4 py-2 rounded shadow bg-white hover:bg-gray-200 dark:bg-gray-800 text-slate-900 accent-blue-600 dark:accent-blue-600 dark:text-gray-100 dark:hover:bg-gray-900" 
            >
              Add to Cart
            </button>
            
            <button
              onClick={toggleWishlist}
              className={`cursor-pointer  px-4 py-2 rounded shadow ${
                inWishlist ? "bg-white dark:bg-gray-800 text-slate-900 accent-blue-600 dark:accent-blue-600 dark:text-gray-100" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 dark:hover:text-white"
              }`}
            >
              {inWishlist ? "❤️ Wishlist" : "🤍 Wishlist"}
            </button>

          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Customer Reviews</h3>
            {reviews.length === 0 && <p>No reviews yet.</p>}

            {reviews.map((r) => (
              <div key={r._id} className="relative border border-gray-200 rounded shadow p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{r.user?.username || "Anonymous"}</span>
                  <ReactStars
                    count={5}
                    value={r.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                  />
                </div>
                <p>{r.comment}</p>

                {/* User review menu */}
                {userReview && r._id === userReview._id && (
                  <div className="absolute inline-block text-right right-4 bottom-2">
                    <button
                      className="text-gray-600"
                      onClick={() => setMenuOpenId(menuOpenId === r._id ? null : r._id)}
                    >
                      ⋮
                    </button>
                    {menuOpenId === r._id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-10">
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setEditingReviewId(r._id);
                            setMenuOpenId(null);
                            setRating(userReview.rating);
                            setComment(userReview.comment);
                          }}
                        >
                          Edit Review
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                          onClick={handleDeleteReview}
                        >
                          Delete Review
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add/Edit Review Form */}
          {(!userReview || editingReviewId === userReview?._id) && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">{userReview ? "Edit Your Review" : "Write a Review"}</h4>
              <ReactStars
                count={5}
                value={rating}
                onChange={setRating}
                size={24}
                activeColor="#ffd700"
              />
              <textarea
                placeholder="Write your review..."
                className="w-full border p-3 rounded mt-2 mb-3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={handleReviewSubmit}
                className="cursor-pointer px-4 py-2 rounded shadow bg-white hover:bg-gray-200 dark:bg-gray-800 text-slate-900 accent-blue-600 dark:accent-blue-600 dark:text-gray-100 dark:hover:bg-gray-900 "
              >
                {userReview ? "Update Review" : "Submit Review"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
