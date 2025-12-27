import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.token) {
        setError(data.msg || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ name: data.name, email: data.email })
      );

      navigate("/");
    } catch (err) {
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>M-Engine AI</h2>
        <p>Login to access smart AI tools</p>

        {error && <div className="error-msg">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  
</div>


        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        

        <span>
          New user? <Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
}
