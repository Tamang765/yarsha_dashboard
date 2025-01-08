import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/session";

const CreateUser = ({ user, close }: any) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "player",
  });

  // Update form state if user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        // Edit user
        await axiosInstance.put(`/user/${user.id}`, formData);
        alert("User updated successfully");
        close();
      } else {
        // Create new user
        await axiosInstance.post("/user", formData);
        alert("User created successfully");
        close();
      }
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-w-4xl  mx-auto mt-10 p-6 bg-white ">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {user ? "Edit" : `Create`} User
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter user's name"
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter user's email"
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>
        {!user && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter user's password"
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        )}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            {/* <option value="player">Player</option> */}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {user ? "Edit" : `Create`} User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
