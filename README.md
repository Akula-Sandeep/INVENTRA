# INVENTRA

Inventra is a full-stack inventory management system built with **FastAPI** and **React**. It provides secure user authentication, comprehensive product management with real-time search and sorting, and a modern, responsive UI.

---

## 🚀 Features

### 🔐 Authentication & Security

* **User Registration** - Create new accounts with username, email, and password
* **User Login** - Secure login with JWT (JSON Web Tokens)
* **Protected API Routes** - All endpoints require valid JWT token
* **User-Specific Data** - Each user only sees their own products (no cross-user data leaks)
* **Password Security** - Passwords hashed with bcrypt + SHA256

### 📦 Product Management

* **Complete CRUD Operations**
  * ✅ Create products with name, description, price, and quantity
  * ✅ Read/View all user products
  * ✅ Update product details
  * ✅ Delete products with confirmation
* **Product Details Tracking** - Name, description, price, quantity
* **Data Persistence** - All data stored securely in PostgreSQL

### 🔍 Search & Filtering

* **Advanced Search** - Filter products by:
  * Product ID
  * Product name
  * Description
  * Price
  * Quantity
* **Real-Time Filtering** - Instant results as you type

### 📊 Sorting & Organization

* **Multi-Field Sorting** - Sort by ID, name, price, or quantity
* **Bidirectional Sort** - Toggle between ascending and descending order
* **Product Count Display** - See total number of products at a glance
* **Responsive Table Layout** - Clean, organized product listing

### 💻 User Interface Features

* **Clean, Modern Design** - Intuitive product management dashboard
* **Real-Time Notifications**
  * ✅ Success messages for operations (auto-dismiss)
  * ✅ Error messages for failed operations
  * ✅ Loading states during API calls
* **Form Validation** - Input validation for all product fields:
  * Required fields check
  * Positive price validation
  * Non-negative quantity validation
* **Action Buttons** - Quick access to:
  * Refresh products list
  * Logout
  * Edit/Delete products
* **Edit Mode** - Switch between Add and Edit forms
* **Responsive Design** - Works on desktop and mobile devices

### 🌐 Full-Stack Architecture

* **Backend** - FastAPI (high-performance Python framework)
* **Frontend** - React (modern UI library)
* **Communication** - REST API with automatic JWT token injection
* **Interceptors** - Axios interceptors for seamless auth token handling

### ⚙️ Environment-Based Configuration

* **Secure Credential Handling** - Database credentials via environment variables
* **Configurable CORS** - Support multiple frontend origins
* **Local & Production Modes** - Same codebase works everywhere
* **Flexible Authentication** - Support both email and username login

---

## 🧱 Tech Stack

* **Backend:** FastAPI, Python 3.12+, SQLAlchemy ORM
* **Frontend:** React 18, Axios, Modern ES6+
* **Database:** PostgreSQL
* **Authentication:** JWT (JSON Web Tokens), bcrypt
* **Security:** CORS middleware, password hashing
* **Server:** Uvicorn (ASGI server)

---

## 📁 Project Structure

```id="z1xk9p"
INVENTRA/
 ├── backend/
 ├── frontend/
 ├── .env.example
 ├── .gitignore
 └── README.md
```

---

## 🛠️ Backend Setup

### Requirements

* Python 3.12+
* PostgreSQL running locally

### Setup

```bash id="j3v6k1"
python -m venv myenv
```

Activate:

```bash id="p0q9z7"
# Windows PowerShell
.\myenv\Scripts\Activate.ps1

# Windows CMD
.\myenv\Scripts\activate.bat
```

Install dependencies:

```bash id="l9e2fa"
cd backend
pip install -r requirements.txt
```

### Environment Variables

* `DATABASE_URL`
  Default: `postgresql://postgres:1234@localhost:5432/inventra`

* `SECRET_KEY`

* `ACCESS_TOKEN_EXPIRE_MINUTES`

* `CORS_ORIGINS`

Example:

```id="n6s0bz"
http://localhost:3000,https://your-vercel-app.vercel.app
```

---

## ▶️ Run Backend

```bash id="kq8m2v"
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

OR

```bash id="d2a4tx"
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 💻 Frontend Setup

```bash id="r8c6hv"
cd frontend
npm install
npm start
```

---

## 🧪 Notes

* Backend uses secure environment-based configs
* API is protected with JWT authentication
* Frontend avoids API calls before login
* `.gitignore` excludes unnecessary files (env, node_modules, etc.)

---

## 🔮 Future Improvements

* Role-based access (Admin/User)
* Dashboard analytics (charts, insights)
* Image upload for products
* Deployment (Vercel + Render)
* Real-time updates

---
