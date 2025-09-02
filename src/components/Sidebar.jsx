import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const COLORS = {
  maroon: "#800000",
  yellow: "#FFC107",
  cardBg: "#ffffff",
  textLight: "#6b7280",
};

const links = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Categories", path: "/categories" },
  { name: "Quotes", path: "/quotes" },
  { name: "Explore", path: "/explore" },
  { name: "Sound", path: "/sound" },


];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div
      className="w-64 h-screen fixed shadow-xl flex flex-col"
      style={{ backgroundColor: COLORS.cardBg }}
    >
      {/* Logo / Header */}
      <div
        className="p-6 text-2xl font-bold tracking-wide border-b border-gray-200"
        style={{ color: COLORS.maroon }}
      >

        <div className="text-sm font-normal text-gray-400">Admin Panel</div>
      </div>

      {/* Navigation */}
      <ul className="mt-6 flex-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <li key={link.name} className="relative group">
              {isActive && (
                <div className="absolute left-0 top-0 h-full w-1 bg-[#800000] rounded-r-sm"></div>
              )}
              <Link
                to={link.path}
                className={`block px-6 py-3 transition-all font-medium rounded-l-full ${isActive
                  ? "bg-[#800000] text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#800000]"
                  }`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}

        {/* 🔐 Logout */}
        <li className="mt-4">
          <button
            onClick={handleLogout}
            className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 transition font-medium"
          >
            🚪 Logout
          </button>
        </li>
      </ul>

      {/* Footer */}
      <div className="p-4 text-xs text-center text-gray-400 border-t border-gray-200">
        © 2025 Quotes Admin
      </div>
    </div>
  );
};

export default Sidebar;
