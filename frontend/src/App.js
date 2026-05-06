  import React, { useEffect, useState, useMemo } from "react";
  import axios from "axios";
  import "./App.css";
  import TaglineSection from "./TaglineSection";
  import Login from "./login";

  // Backend URL from environment or default to Render URL
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://inventra-eaht.onrender.com";

  const api = axios.create({
    baseURL: BACKEND_URL,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  

  function App() {
 
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
      name: "",
      description: "",
      price: "",
      quantity: "",
    });
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortField, setSortField] = useState("id");
    const [sortDirection, setSortDirection] = useState("asc");

    const handleLogout = () => {
      localStorage.removeItem("token");
      setToken(null);
      setProducts([]);
      setMessage("");
      setError("");
    };


    // Auto-dismiss messages after 5 seconds
    useEffect(() => {
      if (message) {
        const timer = setTimeout(() => {
          setMessage("");
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [message]);

    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => {
          setError("");
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [error]);

    // Fetch all products
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        setProducts(res.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch products");
      }
      setLoading(false);
    };

    useEffect(() => {
      if (!token) {
        return;
      }
      // Inline initial fetch to avoid referencing external deps
      const run = async () => {
        setLoading(true);
        try {
          const res = await api.get("/products");
          setProducts(res.data);
          setError("");
        } catch (err) {
          setError("Failed to fetch products");
        }
        setLoading(false);
      };
      run();
    }, [token]);

    // Handle sorting
    const handleSort = (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    };

    // Derived list with filter and sorting
    const filteredProducts = useMemo(() => {
      let filtered = products;
      
      // Apply filter
      const q = filter.trim().toLowerCase();
      if (q) {
        filtered = products.filter((p) =>
          String(p.id).includes(q) ||
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          String(p.price).includes(q) ||
          String(p.quantity).includes(q)
        );
      }
      
      // Apply sorting
      return filtered.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        // Handle numeric fields
        if (sortField === "id" || sortField === "price" || sortField === "quantity") {
          aVal = Number(aVal);
          bVal = Number(bVal);
        } else {
          // Handle string fields
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();
        }
        
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }, [products, filter, sortField, sortDirection]);

    if (!token) {
      return  (<div className="app-bg">
      <div className="container" style={{ textAlign: "center", paddingTop: "100px" }}>
        <h1>INVENTRA</h1>
        <p>Smart Inventory Management System</p>
        <Login setToken={setToken} />
      </div>
    </div>
  );
    }

    // Handle form input
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Reset form
    const resetForm = () => {
      setForm({ name: "", description: "", price: "", quantity: "" });
      setEditId(null);
    };

    // Create or update product
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");
      setError("");

      // Validation
      if (!form.name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }
      if (!form.description.trim()) {
        setError("Description is required");
        setLoading(false);
        return;
      }
      const price = parseFloat(form.price);
      if (isNaN(price) || price <= 0) {
        setError("Price must be a positive number");
        setLoading(false);
        return;
      }
      const quantity = parseInt(form.quantity);
      if (isNaN(quantity) || quantity < 0) {
        setError("Quantity must be a non-negative integer");
        setLoading(false);
        return;
      }

      try {
        if (editId) {
          await api.put(`/products/${editId}`, {
            name: form.name.trim(),
            description: form.description.trim(),
            price: price,
            quantity: quantity,
          });
          setMessage("Product updated successfully");
        } else {
          await api.post("/products", {
            name: form.name.trim(),
            description: form.description.trim(),
            price: price,
            quantity: quantity,
          });
          setMessage("Product created successfully");
        }
        resetForm();
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.detail || "Operation failed");
      }
      setLoading(false);
    };

    // Edit product
    const handleEdit = (product) => {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
      });
      setEditId(product.id);
      setMessage("");
      setError("");
    };

    // Delete product
    const handleDelete = async (id) => {
      const ok = window.confirm("Delete this product?");
      if (!ok) return;
      setLoading(true);
      setMessage("");
      setError("");
      try {
        await api.delete(`/products/${id}`);
        setMessage("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        setError("Delete failed");
      }
      setLoading(false);
    };

    const currency = (n) =>
      typeof n === "number" ? n.toFixed(2) : Number(n || 0).toFixed(2);

    return (
      <div className="app-bg">
        <header className="topbar">
          <div className="brand">
            <span className="brand-badge">📦</span>
            <h1>INVENTRA</h1>
          </div>
          <div className="top-actions">
            <button className="btn btn-light" onClick={fetchProducts} disabled={loading}>
              Refresh
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="container">
          <div className="stats">
            <div className="chip">Total: {products.length}</div>
            <div className="search">
              <input
                type="text"
                placeholder="Search by id, name, description, price or quantity..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="content-grid">
            <div className="card form-card">
              <h2>{editId ? "Edit Product" : "Add Product"}</h2>
              <form onSubmit={handleSubmit} className="product-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                />
                <div className="form-actions">
                  <button className="btn" type="submit" disabled={loading}>
                    {editId ? "Update" : "Add"}
                  </button>
                  {editId && (
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => {
                        resetForm();
                        setMessage("");
                        setError("");
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              {message && <div className="success-msg">{message}</div>}
              {error && <div className="error-msg">{error}</div>}
            </div>
            
            <TaglineSection />

            <div className="card list-card">
              <h2>Products</h2>
              {loading ? (
                <div className="loader">Loading...</div>
              ) : (
                <div className="scroll-x">
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th 
                          className={`sortable ${sortField === 'id' ? `sort-${sortDirection}` : ''}`}
                          onClick={() => handleSort('id')}
                        >
                          ID
                        </th>
                        <th 
                          className={`sortable ${sortField === 'name' ? `sort-${sortDirection}` : ''}`}
                          onClick={() => handleSort('name')}
                        >
                          Name
                        </th>
                        <th>Description</th>
                        <th 
                          className={`sortable ${sortField === 'price' ? `sort-${sortDirection}` : ''}`}
                          onClick={() => handleSort('price')}
                        >
                          Price
                        </th>
                        <th 
                          className={`sortable ${sortField === 'quantity' ? `sort-${sortDirection}` : ''}`}
                          onClick={() => handleSort('quantity')}
                        >
                          Quantity
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td className="name-cell">{p.name}</td>
                          <td className="desc-cell" title={p.description}>{p.description}</td>
                          <td className="price-cell">${currency(p.price)}</td>
                          <td>
                            <span className="qty-badge">{p.quantity}</span>
                          </td>
                          <td>
                            <div className="row-actions">
                              <button className="btn btn-edit" onClick={() => handleEdit(p)}>
                                Edit
                              </button>
                              <button className="btn btn-delete" onClick={() => handleDelete(p.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={6} className="empty">
                            No products found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default App;