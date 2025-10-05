import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, UserCircle, Star, StarOff } from "lucide-react";
import toast from "react-hot-toast";
import { baseUrl } from "../../api";

function LandingReview() {
  const [reviews, setReviews] = useState([]);
  const sliderRef = useRef(null);

  // ✅ Fetch all reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${baseUrl}/review/all`);
      console.log("Reviews:", res.data);
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ⭐ Render stars based on rating (1–5)
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        ) : (
          <StarOff key={i} className="w-5 h-5 text-gray-300" />
        )
      );
    }
    return stars;
  };

  // ▶ Slider Navigation
  const scrollNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 relative px-4">
      <h2 className="text-2xl font-semibold mb-6 text-left">What Our Customers Say</h2>

      <button
        onClick={scrollPrev}
        className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 bg-white shadow border rounded-full p-2 hover:bg-gray-100 z-10"
      >
        <ChevronLeft size={24} />
      </button>

      <div ref={sliderRef} className="overflow-x-auto scroll-smooth no-scrollbar">
        <div className="flex gap-6 min-w-max">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div
                key={index}
                className="w-60 flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-4 text-center"
              >
              
                <div className="flex justify-center mb-3">
                  <UserCircle className="h-16 w-16 text-gray-400" />
                </div>

               
                <h5 className="text-lg font-semibold text-gray-800">{review.userName}</h5>

               
                <div className="flex justify-center mt-1 mb-2">
                  {renderStars(review.rating)}
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 text-left">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="px-1 py-1 md:px-2 md:py-2 text-gray-500 text-center">No reviews found</p>
          )}
        </div>
      </div>
      <button
        onClick={scrollNext}
        className="hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 bg-white shadow border rounded-full p-2 hover:bg-gray-100 z-10"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

export default LandingReview;
