import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      if (user.role === "admin") {
        navigate("/admin");
      }
      if (user.role === "staff") {
        navigate("/staff");
      }
      if (user.role === "player") {
        navigate("/player");
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded"
        >
          Login
        </button>
        <div className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
