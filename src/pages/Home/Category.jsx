import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../api';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Category() {
    
      const [categories, setCategories] = useState([]);
      
  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${baseUrl}/category`);
        setCategories(res.data.categoryInfo || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div>
  <h2 className='text-2xl text-left font-semibold py-6'>Category</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
        {categories.length > 0 ? (
                  categories.map((cat) => (
                    
<div className='col-span-3 md:col-span-2 lg:col-span-1'>
                    {/* <p
                      key={cat._id}
                      to={`/shop/${cat.title}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {cat.title}
                    </p> */}
                    <div key={cat._id} className="flex flex-col border-gray-300 hover:border-blue-200 min-h-48 border p-6">
          {/* <p className="text-right mb-2">{cat.productCount} Products</p> */}
          <Link to={`/category/${cat._id}`} className="relative overflow-hidden mb-4">
            <img className="w-full object-contain transition-transform duration-500 hover:scale-110 h-36" 
            src={cat.image} alt={cat.title} />
          </Link>
          <h5 className="text-lg font-semibold">{cat.title}</h5>
        </div>
        </div>
                  ))
                ) : (
                  <p className="px-4 py-2 text-gray-500 text-center">No categories</p>
                )}
    
    </div>
    </div>
  )
}

export default Category
