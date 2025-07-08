import React from "react";
import { FaFeatherAlt } from "react-icons/fa"; // FontAwesome icon for branding

const Navbar = () => {
  return (
    <header className="w-full bg-[#800000] text-white shadow-md z-10">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <FaFeatherAlt className="text-yellow-300 text-xl" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
            हिंदी शायरी - Admin
          </h1>
        </div>

        {/* Future Features Placeholder (optional) */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Add user avatar / logout / notifications if needed */}
          <span className="text-sm text-yellow-100">Welcome, Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
