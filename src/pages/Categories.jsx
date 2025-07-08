import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../apis/AxiosInstance";
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

const COLORS = {
  background: "#fdf6ec",
  maroon: "#800000",
};

const PAGE_SIZE = 10;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "" });
  const [emoji, setEmoji] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setIconFile(e.target.files[0]);
  };

  // const uploadIcon = async () => {
  //   if (!iconFile) return null;
  //   const formData = new FormData();
  //   formData.append("file", iconFile);
  //   const res = await axiosInstance.post("/upload", formData);
  //   return res.data.url;
  // };

  const handleSave = async () => {
    if (!form.name.trim()) return;

    try {
      const formData = new FormData();
      formData.append("title", form.name);
      formData.append("emoji", emoji);
      if (iconFile) {
        formData.append("icon", iconFile); // 👈 this will be available in req.files.icon
      }

      if (form.id) {
        await axiosInstance.put(`/categories/${form.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axiosInstance.post("/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      await fetchCategories();
      setForm({ id: null, name: "" });
      setEmoji("");
      setIconFile(null);
      setIsOpen(false);
    } catch (err) {
      console.error("Save category error:", err);
    }
  };

  const handleEdit = (category) => {
    setForm({ id: category._id, name: category.title });
    setEmoji(category.emoji || "");
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
      await fetchCategories();
    } catch (err) {
      console.error("Delete category error:", err);
    }
  };

  // 🔍 Filter & Sort Logic
  const filteredData = categories
    .filter(
      (cat) =>
        cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.emoji && cat.emoji.includes(searchTerm))
    )
    .sort((a, b) =>
      sortBy === "title"
        ? a.title.localeCompare(b.title)
        : (a.emoji || "").localeCompare(b.emoji || "")
    );

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  return (
    <>
      <Sidebar />
      <div
        className="ml-64 w-full min-h-screen p-6"
        style={{ backgroundColor: COLORS.background }}
      >
        <h1 className="text-3xl font-bold text-[#800000] mb-6">
          📚 Manage Categories
        </h1>

        {/* Search and Sort */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search by name or emoji"
            className="px-4 py-2 border rounded w-full max-w-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="title">Sort by Name</option>
            <option value="emoji">Sort by Emoji</option>
          </select>
        </div>

        <button
          onClick={() => {
            setForm({ id: null, name: "" });
            setEmoji("");
            setIconFile(null);
            setIsOpen(true);
          }}
          className="mb-6 bg-[#800000] hover:bg-[#a32d2d] text-white px-5 py-2 rounded-lg shadow transition"
        >
          ➕ Add Category
        </button>

        {loading ? (
          <div className="flex justify-center py-10">
            <svg
              className="animate-spin h-8 w-8 text-[#800000]"
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
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-lg rounded-xl">
                <thead className="bg-gray-100 text-sm text-gray-600">
                  <tr>
                    <th className="p-4 text-left">Emoji</th>
                    <th className="p-4 text-left">Category Name</th>
                    <th className="p-4 text-left">Icon</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((cat) => (
                    <tr
                      key={cat._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-4 text-xl">{cat.emoji}</td>
                      <td className="p-4 font-medium text-gray-800">
                        {cat.title}
                      </td>
                      <td className="p-4">
                        {cat.iconUrl && (
                          <img
                            src={cat.iconUrl}
                            alt="icon"
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                      </td>
                      <td className="p-4 text-right space-x-4">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-gray-500">
                        No categories available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-1 rounded-full text-sm ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#800000] text-white"
                  }`}
                >
                  <FaArrowLeft className="mr-1" /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      currentPage === index + 1
                        ? "bg-[#800000] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 py-1 rounded-full text-sm ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#800000] text-white"
                  }`}
                >
                  Next <FaArrowRight className="ml-1" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
        >
          <h2 className="text-xl font-semibold text-[#800000] mb-4">
            {form.id ? "✏️ Edit" : "➕ Add"} Category
          </h2>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 focus:border-[#800000] focus:ring-[#800000] p-2 rounded outline-none mb-4"
            placeholder="Enter category name"
          />

          <label className="block mb-2 text-sm font-medium">Upload Icon</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />

          <label className="block mb-2 text-sm font-medium">Select Emoji</label>
          <EmojiPicker onEmojiClick={(e) => setEmoji(e.emoji)} />
          {emoji && <p className="text-xl mt-2">{emoji}</p>}
        </Modal>
      </div>
    </>
  );
};

export default Categories;
