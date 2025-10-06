import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../api";

import CategoryTable from "./CategoryTable";
import CategoryModal from "./CategoryModal";
import ProductModal from "./ProductModal";
import OrderModal from "./OrderModal";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer , PieChart, Pie, Cell, Legend } from "recharts";
import { ChevronDown, ChevronRight } from "lucide-react";

const COLORS = ["#4f46e5", "#f97316", "#10b981"]; 
function AdminDashboard() {
  /** State **/
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    productsPerSeller: [],
  });
  const [chartData, setChartData] = useState([]);

  /** Collapsible states **/
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  /** Modals **/
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [showProductModal, setShowProductModal] = useState(false);
  const [formProduct, setFormProduct] = useState({
    _id: "", title: "", description: "", price: "", quantity: "", image: "", category: ""
  });
  const [editingProduct, setEditingProduct] = useState(false);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  /** Initialization **/
  useEffect(() => {
    if (!token) return toast.error("Please log in as Admin");

    try {
      const decoded = jwtDecode(token);
      if (decoded?.role !== "admin") return toast.error("Access denied: Admin only");
    } catch {
      return toast.error("Invalid token");
    }

    fetchCategories();
    fetchProducts();
    fetchOrders();
    fetchDashboardStats();
  }, []);

  /** Fetch Functions **/
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/category`);
      setCategories(res.data.categoryInfo || []);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/product`);
      const productsList = res.data.products || [];
      setProducts(productsList);
      generateCategoryChart(productsList);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${baseUrl}/order`, axiosConfig);
      setOrders(res.data.orders || []);
    } catch {
      toast.error("Failed to fetch orders");
    }
  };
const fetchDashboardStats = async () => {
  try {
    const res = await axios.get(`${baseUrl}/admin/dashboard`, axiosConfig);
    const data = res.data;

    // Prepare user count chart for donut
    const userRoleData = [
      { name: "Buyer", value: data.totalUsers || 0 },
      { name: "Seller", value: data.totalSellers || 0 },
      { name: "Admin", value: data.totalAdmins || 0 }
    ];

    setDashboardStats({ ...data, userRoleData });
  } catch {
    toast.error("Failed to fetch dashboard stats");
  }
};



  /** Charts **/
  const generateCategoryChart = (productsList) => {
    const counts = {};
    productsList.forEach(p => {
      const cat = p.category?.title || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const chartArray = Object.keys(counts).map(name => ({ name, count: counts[name] }));
    setChartData(chartArray);
  };

  /** Category Handlers **/
  const handleAddCategory = () => { setEditingCategory(null); setShowCategoryModal(true); };
  const handleEditCategory = (category) => { setEditingCategory(category); setShowCategoryModal(true); };
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${baseUrl}/category/${id}`, axiosConfig);
      toast.success("Category deleted"); fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || "Delete failed"); }
  };

  /** Product Handlers **/
  const handleAddProduct = () => {
    setFormProduct({ _id: "", title: "", description: "", price: "", quantity: "", image: "", category: "" });
    setEditingProduct(false); setShowProductModal(true);
  };
  const handleEditProduct = (product) => {
    setFormProduct({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: product.image,
      category: product.category?._id || ""
    });
    setEditingProduct(true); setShowProductModal(true);
  };
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${baseUrl}/product/${id}`, axiosConfig);
      toast.success("Product deleted"); fetchProducts(); fetchDashboardStats();
    } catch { toast.error("Delete failed"); }
  };

  const handleSaveProduct = async () => {
    try {
      const { _id, ...payload } = formProduct;
      if (editingProduct) await axios.put(`${baseUrl}/product/${_id}`, payload, axiosConfig);
      else await axios.post(`${baseUrl}/product`, payload, axiosConfig);
      toast.success(editingProduct ? "Product updated" : "Product added");
      fetchProducts(); fetchDashboardStats(); setShowProductModal(false);
    } catch { toast.error("Save failed"); }
  };

  /** Order Handlers **/
  const handleViewOrder = (order) => { setSelectedOrder(order); setShowOrderModal(true); };
  const handleDeleteOrder = async (id) => {
    try { await axios.delete(`${baseUrl}/order/${id}`, axiosConfig); toast.success("Order deleted"); fetchOrders(); }
    catch { toast.error("Delete failed"); }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${baseUrl}/order/${orderId}/status`, { status: newStatus }, axiosConfig);
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order status");
    }
  };
{/*Screen version */}

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // mobile & tablet
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
   if (isMobile) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 text-center p-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">⚠️ Desktop Only</h1>
          <p className="text-gray-600">
            The Admin Dashboard is only accessible on desktop devices.  
            Please use a larger screen to continue.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Total Revenue</h3>
          <p className="text-xl font-bold">₹{dashboardStats.totalRevenue}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Total Users</h3>
          <p className="text-xl font-bold">{dashboardStats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Total Sellers</h3>
          <p className="text-xl font-bold">{dashboardStats.totalSellers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Total Products</h3>
          <p className="text-xl font-bold">{dashboardStats.totalProducts}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Products by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#4f46e5" /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow">
 <h2 className="text-lg font-semibold mb-4">Users by Role</h2>
  <ResponsiveContainer width="100%" height={300}>
  <PieChart>
  <Pie
    data={dashboardStats.userRoleData || []} // <-- safe fallback
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={100}
    fill="#8884d8"
    label
  >
    {(dashboardStats.userRoleData || []).map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend verticalAlign="bottom" height={36} />
</PieChart>

  </ResponsiveContainer>

        </div>
      </div>

      {/* CATEGORY SECTION */}
      <div className="bg-white rounded shadow mb-4">
        <button
          className="w-full flex justify-between items-center p-4 text-left font-semibold"
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
          <span>📁 Categories</span>
          {categoryOpen ? <ChevronDown /> : <ChevronRight />}
        </button>
        {categoryOpen && (
          <div className="p-4 border-t">
            <CategoryTable categories={categories} onEdit={handleEditCategory} onDelete={handleDeleteCategory} onAdd={handleAddCategory} />
          </div>
        )}
      </div>

      {/* PRODUCT SECTION */}
      <div className="bg-white rounded shadow mb-4">
        <button
          className="w-full flex justify-between items-center p-4 text-left font-semibold"
          onClick={() => setProductOpen(!productOpen)}
        >
          <span>🛍️ Products</span>
          {productOpen ? <ChevronDown /> : <ChevronRight />}
        </button>
        {productOpen && (
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Product List</h2>
              <button onClick={handleAddProduct} className="bg-gray-800 text-white px-1 py-1 md:px-2 md:py-2 rounded">+ Add Product</button>
            </div>
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-1 py-1 md:p-2 text-left">Title</th>
                  <th className="px-1 py-1 md:p-2 text-left hidden md:inline">Category</th>
                  <th className="px-1 py-1 md:p-2 text-left">Price</th>
                  <th className="px-1 py-1 md:p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length ? products.map(p => (
                  <tr key={p._id} className="border-b">
                    <td className="px-1 py-1 md:p-2 ">{p.title}</td>
                    <td className="px-1 py-1 md:p-2   hidden md:inline">{p.category?.title || "—"}</td>
                    <td className="px-1 py-1 md:p-2 ">₹{p.price}</td>
                    <td className="px-1 py-1 md:p-2  flex gap-2">
                      <button onClick={() => handleEditProduct(p)} className="bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
                      <button onClick={() => handleDeleteProduct(p._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="4" className="text-center py-4 text-gray-500">No products found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER SECTION */}
      <div className="bg-white rounded shadow mb-4">
        <button
          className="w-full flex justify-between items-center p-4 text-left font-semibold"
          onClick={() => setOrderOpen(!orderOpen)}
        >
          <span>📦 Orders</span>
          {orderOpen ? <ChevronDown /> : <ChevronRight />}
        </button>
        {orderOpen && (
          <div className="p-4 border-t">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-1 py-1 md:p-2 text-left">Order ID</th>
                  <th className="px-1 py-1 md:p-2 text-left">User</th>
                  <th className="px-1 py-1 md:p-2 text-left">Total Amount</th>
                  <th className="px-1 py-1 md:p-2 text-left">Payment Status</th>
                  <th className="px-1 py-1 md:p-2 text-left">Order Status</th>
                  <th className="px-1 py-1 md:p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length ? orders.map(o => (
                  <tr key={o._id} className="border-b">
                    <td className="px-1 py-1 md:p-2 ">{o._id}</td>
                    <td className="px-1 py-1 md:p-2 ">{o.user?.username || o.user?.email}</td>
                    <td className="px-1 py-1 md:p-2 ">₹{o.totalAmount}</td>
                    <td className="px-1 py-1 md:p-2  capitalize">{o.paymentStatus}
                    </td>
                    <td className="px-1 py-1 md:p-2  capitalize">{o.orderStatus}
                    </td>
                    <td className="px-1 py-1 md:p-2  flex gap-2">
                      <button onClick={() => handleViewOrder(o)} className="bg-green-600 text-white px-3 py-1 rounded">View</button>
                      <button onClick={() => handleDeleteOrder(o._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="5" className="text-center py-4 text-gray-500">No orders found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCategoryModal && <CategoryModal onClose={() => setShowCategoryModal(false)} category={editingCategory} onSuccess={fetchCategories} />}
      {showProductModal && <ProductModal show={showProductModal} onClose={() => setShowProductModal(false)} categories={categories} formProduct={formProduct} setFormProduct={setFormProduct} onSave={handleSaveProduct} editing={editingProduct} />}
      {showOrderModal && <OrderModal show={showOrderModal} onClose={() => setShowOrderModal(false)} order={selectedOrder} onSaved={fetchOrders} />}
    </div>
  );
}

export default AdminDashboard;
