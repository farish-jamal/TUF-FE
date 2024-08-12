import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
     const toastId = toast.loading('Registration in process...');
      const response = await axios.post(
        "https://tuf-be.onrender.com/api/admin/register",
        {
          username: username,
          password: password,
        }
      );

      if (response.status !== 200) {
        toast.error(response.data.message || "Registration failed");
        return;
      }
      toast.dismiss(toastId);
      toast.success("Registration successful");
      localStorage.setItem("token", response.data.token);

      setTimeout(() => {
        navigateTo("/dashboard");
      }, 3000);
    } catch (error) {
     toast.error("Internal server error");
     console.error(error);
    }
  };

  return (
    <>
      <Toaster position="top-right" duration="3000" />
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Link
          to="/"
          className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
        >
          Back to Homepage
        </Link>
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Register
          </h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
