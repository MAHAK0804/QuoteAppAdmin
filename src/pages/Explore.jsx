import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaUpload, FaEdit, FaTrash } from "react-icons/fa";

const COLORS = {
    background: "#fdf6ec",
    maroon: "#800000",
    yellow: "#FFC107",
    cardBg: "#ffffff",
    textLight: "#6b7280",
};

export default function ImageCrudPage() {
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchImages = async () => {
        const res = await axios.get("https://quoteappserver.onrender.com/api/explore");
        setImages(res.data);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select an image!");
        const formData = new FormData();
        formData.append("image", file);

        setLoading(true);
        try {
            if (editId) {
                await axios.put(`https://quoteappserver.onrender.com/api/explore/${editId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setEditId(null);
            } else {
                await axios.post("https://quoteappserver.onrender.com/api/explore", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            setFile(null);
            fetchImages();
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this image?")) return;
        await axios.delete(`https://quoteappserver.onrender.com/api/explore/${id}`);
        fetchImages();
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="w-full flex">
            <Sidebar />
            <div
                className="ml-64 w-full min-h-screen p-8"
                style={{ backgroundColor: COLORS.background }}
            >
                <h1
                    className="text-3xl font-bold mb-6"
                    style={{ color: COLORS.maroon }}
                >
                    Explore
                </h1>

                {/* Upload Form */}
                <div className="flex items-center gap-3 mb-8 bg-white shadow-md p-4 rounded-xl">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="border p-2 rounded w-64"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        style={{
                            backgroundColor: COLORS.maroon,
                        }}
                        className="flex items-center gap-2 text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
                    >
                        <FaUpload />
                        {loading ? "Uploading..." : editId ? "Update" : "Upload"}
                    </button>
                </div>

                {/* Images Grid */}
                {images.length === 0 ? (
                    <p className="text-center text-lg" style={{ color: COLORS.textLight }}>
                        No images uploaded yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {images.map((img) => (
                            <div
                                key={img._id}
                                className="rounded-xl shadow-lg overflow-hidden bg-white flex flex-col"
                            >
                                <img
                                    src={img.url}
                                    alt="uploaded"
                                    className="h-40 w-full object-cover"
                                />
                                <div className="flex justify-between items-center p-3">
                                    <button
                                        onClick={() => {
                                            setEditId(img._id);
                                            alert("Now choose a new image to replace this one.");
                                        }}
                                        className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm"
                                        style={{
                                            backgroundColor: COLORS.yellow,
                                            color: COLORS.maroon,
                                        }}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img._id)}
                                        className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm text-white"
                                        style={{
                                            backgroundColor: COLORS.maroon,
                                        }}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
