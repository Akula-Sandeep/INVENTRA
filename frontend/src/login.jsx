import { useState } from "react";
import axios from "axios";
import "./login.css";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
     const params = new URLSearchParams();
     params.append("username", registerEmail);  // use your input variable
     params.append("password", password);

     const response = await axios.post(
     "https://inventra-eaht.onrender.com/login",
      params,
   
      );

      localStorage.setItem("token", response.data.access_token);
      setToken(response.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
    setLoading(false);
  };
const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await axios.post(
      "https://inventra-eaht.onrender.com/register",
      {
        username: username,
        email: registerEmail,
        password: registerPassword,
      }
    );

    console.log("REGISTER SUCCESS:", response.data);

  } catch (err) {
    console.log("REGISTER ERROR:", err.response?.data);
    setError("Registration failed");
  }

  setLoading(false);
};

      alert("Registration successful! Please login.");
      setIsRegister(false);
      setUsername("");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">Inventra</h1>
        <p className="subtitle">Smart Inventory. Simplified.</p>

        {isRegister ? (
          <form onSubmit={handleRegister}>
            <h2>Sign Up</h2>
            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="bottom-text">
              Already have an account? <span onClick={() => setIsRegister(false)}>Login</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <label>Email or Username</label>
            <input
              type="text"
              placeholder="email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>

            <p className="bottom-text">
              New here? <span onClick={() => setIsRegister(true)}>Sign up</span>
            </p>
          </form>
        )}

        {error && <div className="error-msg">{error}</div>}
      </div>
    </div>
  );
}

export default Login;