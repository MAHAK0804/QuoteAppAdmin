import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../apis/AxiosInstance";
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const COLORS = {
  background: "#fdf6ec",
  maroon: "#800000",
  yellow: "#FFC107",
  cardBg: "#ffffff",
  textLight: "#6b7280",
};

const PAGE_SIZE = 20;

const Shayaris = () => {
  const [shayaris, setShayaris] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    content: "",
    categoryId: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShayaris();
    fetchCategories();
  }, []);

  const fetchShayaris = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/quotes");
      console.log(res.data);

      setShayaris(res.data.quotes);
    } catch (err) {
      console.error("Error fetching shayaris:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleSave = async () => {
    console.log("submitting");

    if (!form.content || !form.categoryId) return;
    console.log(form);

    try {
      setLoading(true);
      if (form.id) {
        await axiosInstance.put(`/quotes/${form.id}`, {
          text: form.content,
          categoryId: form.categoryId,
        });
      } else {
        await axiosInstance.post("/quotes", {
          text: form.content,
          categoryId: form.categoryId,
        });
      }
      await fetchShayaris();
      setForm({ id: null, title: "", content: "", categoryId: "" });
      setIsOpen(false);
    } catch (err) {
      console.error("Error saving shayari:", err);
    } finally {
      setLoading(false);
    }
  };
  console.log("cat id ", form.categoryId);

  const handleEdit = (s) => {
    setForm({
      id: s._id,
      title: s.text.slice(0, 25),
      content: s.text,
      categoryId: s.categoryId,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/quotes/${id}`);
      await fetchShayaris();
    } catch (err) {
      console.error("Error deleting shayari:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = shayaris.filter((s) => {
    const matchesSearch = s.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? s.categoryId === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "asc") return a.text.localeCompare(b.text);
    return b.text.localeCompare(a.text);
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <>
      <Sidebar />
      <div
        className="ml-64 w-full min-h-screen p-6"
        style={{ backgroundColor: COLORS.background }}
      >
        <h1 className="text-3xl font-bold text-[#800000] mb-6">
          📝 Manage Shayaris
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="🔍 Search Shayari..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-64 border p-2 rounded focus:outline-none focus:border-[#800000]"
          />

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded focus:outline-none focus:border-[#800000]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.emoji} {cat.title}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:border-[#800000]"
          >
            <option value="desc">Sort: Newest First</option>
            <option value="asc">Sort: A-Z</option>
          </select>

          <button
            onClick={() => {
              setForm({ id: null, title: "", content: "", categoryId: "" });
              setIsOpen(true);
            }}
            className="bg-[#800000] hover:bg-[#a32d2d] text-white px-5 py-2 rounded-lg shadow transition"
          >
            ➕ Add Shayari
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-lg rounded-xl">
              <thead className="bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Shayari</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((s) => (
                  <tr
                    key={s._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-yellow-700">
                      {categories.find((c) => c._id === s.categoryId)?.emoji}{" "}
                      {categories.find((c) => c._id === s.categoryId)?.title ||
                        "Unknown"}
                    </td>
                    <td className="p-4 text-gray-700 ">
                      {s.text.replace(/\\n/g, "\n").slice(0, 80)}...
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-blue-600"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-red-500"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                {shayaris.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-gray-500">
                      No Shayaris available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 disabled:opacity-50"
            >
              <FaArrowLeft className="mr-1" /> Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-full text-sm ${currentPage === i + 1
                  ? "bg-[#800000] text-white"
                  : "bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 disabled:opacity-50"
            >
              Next <FaArrowRight className="ml-1" />
            </button>
          </div>
        )}

        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
        >
          <h2 className="text-xl font-semibold text-[#800000] mb-4">
            {form.id ? "✏️ Edit" : "➕ Add"} Quotes
          </h2>
          <textarea
            rows={4}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full border border-gray-300 focus:border-[#800000] focus:ring-[#800000] mb-3 p-2 rounded outline-none"
            placeholder="Shayari text"
          ></textarea>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full border border-gray-300 focus:border-[#800000] focus:ring-[#800000] p-2 rounded outline-none mb-3"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.emoji} {cat.title}
              </option>
            ))}
          </select>
        </Modal>
      </div>
    </>
  );
};

export default Shayaris;
