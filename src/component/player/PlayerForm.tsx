import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/session";

const PlayerForm = ({ user, close }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "np",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        country: user.country || "np", // Default to 'np' if not provided
        password: user.password || "",
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

  const handleSubmit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/user/player/update/${id}`, formData);
      alert("Player updated successfully");
      close();
    } catch (error: any) {
      alert("Error fetching data:", error.message);
    }
  };

  return (
    <div className="flex justify-center  bg-gradient-to-r from-teal-500 to-teal-600">
      <div className="bg-white p-8  w-full sm:w-96">
        <h2 className="text-3xl font-extrabold text-center text-teal-600 mb-6">
          Edit Player
        </h2>
        <form onSubmit={(e) => handleSubmit(e, user?.id)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Country
            </label>
            <select
              name="country"
              required
              value={formData.country}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="np">Nepal</option>
              <option value="in">India</option>
              <option value="us">United States</option>
              <option value="au">Australia</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerForm;
