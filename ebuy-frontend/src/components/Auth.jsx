import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios";
import { toast } from "react-toastify";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // If already logged in, go to home
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/products", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // --- LOGIN ---
        const res = await API.post("/login", { username, password });

        if (res.status === 200 && typeof res.data === "string" && res.data.startsWith("eyJ")) {
          // Success - received JWT token
          localStorage.setItem("token", res.data);
          localStorage.setItem("username", username);
          toast.success(`Welcome back, ${username}!`);
          navigate("/products", { replace: true });
        }
      } else {
        // --- REGISTER ---
        const res = await API.post("/register", { username, password });

        if (res.status === 200) {
          // Registration successful - switch to login
          setMessage("Registration successful! Please login.");
          setIsLogin(true);
          setUsername("");
          setPassword("");
          toast.success("Account created! Login to continue.");
        }
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (isLogin) {
        if (status === 401) {
          if (data === "redirect:/register") {
            setMessage("User not found. Please register first.");
            setIsLogin(false);
          } else {
            setMessage("Invalid username or password.");
          }
        } else {
          setMessage("Login failed. Please try again.");
        }
      } else {
        if (status === 409) {
          setMessage("User already exists. Please login.");
          setIsLogin(true);
        } else {
          setMessage("Registration failed. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* ebuy Logo */}
        <div className="auth-logo">
          <span className="auth-logo-e">e</span>
          <span className="auth-logo-b">b</span>
          <span className="auth-logo-u">u</span>
          <span className="auth-logo-y">y</span>
        </div>

        <h2 className="auth-title">{isLogin ? "Sign In" : "Create Account"}</h2>
        <p className="auth-subtitle">
          {isLogin
            ? "Welcome back! Enter your credentials."
            : "Join ebuy today! Create your account."}
        </p>

        {message && <div className="auth-message">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setMessage("");
              }}
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage("");
              }}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <a
          href={`${import.meta.env.VITE_BASE_URL || "http://localhost:8080"}/oauth2/authorization/github`}
          className="auth-github-btn"
        >
          <i className="bi bi-github"></i> Continue with GitHub
        </a>

        <div className="auth-toggle">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button type="button" className="auth-link-btn" onClick={toggleMode}>
                Create one
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button type="button" className="auth-link-btn" onClick={toggleMode}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
