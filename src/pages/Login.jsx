import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(4, "Minimum 4 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await axios.post(
          "https://quoteappserver.onrender.com/api/admin/login",
          values
        );
        const { token } = res.data;
        localStorage.setItem("adminToken", token);
        setSuccess("✅ Login successful!");
        setError("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } catch (err) {
        setError(
          err.response?.data?.error || "Login failed. Please check credentials."
        );
        setSuccess("");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen w-full bg-[#fdf6ec] flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-sm p-6 relative">
        <h2 className="text-2xl font-bold text-center text-[#800000] mb-6">
          Admin Login
        </h2>

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 text-sm rounded shadow flex items-center gap-2 animate-fadeIn">
            <span className="text-lg">✔</span> {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded shadow flex items-center gap-2 animate-fadeIn">
            <span className="text-lg">❌</span> {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className={`w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-[#800000] ${formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
                }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="admin@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-xs text-red-500 mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-[#800000] ${formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-3 text-gray-500"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-xs text-red-500 mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#800000] text-white py-2 rounded hover:bg-[#990000] transition flex items-center justify-center"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
