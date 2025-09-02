import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const COLORS = {
    background: "#fdf6ec",
    maroon: "#800000",
};

export default function SoundManager() {
    const [sounds, setSounds] = useState([]);
    const [file, setFile] = useState(null); // sound file
    const [image, setImage] = useState(null); // thumbnail image
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    // For editing
    const [editingSound, setEditingSound] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editFile, setEditFile] = useState(null);
    const [editImage, setEditImage] = useState(null);
    const [updating, setUpdating] = useState(false);

    // ✅ Fetch sounds
    useEffect(() => {
        fetchSounds();
    }, []);

    const fetchSounds = async () => {
        const res = await axios.get("https://quoteappserver.onrender.com/api/sounds");
        setSounds(res.data);
    };

    // ✅ Upload sound
    const handleUpload = async () => {
        if (!file || !title || !image) {
            alert("Please add title, sound file & image");
            return;
        }
        const formData = new FormData();
        formData.append("sound", file);
        formData.append("image", image);
        formData.append("title", title);

        setLoading(true);
        await axios.post("https://quoteappserver.onrender.com/api/sounds", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setLoading(false);
        setTitle("");
        setFile(null);
        setImage(null);
        fetchSounds();
    };

    // ✅ Delete sound
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this sound?")) return;
        await axios.delete(`https://quoteappserver.onrender.com/api/sounds/${id}`);
        fetchSounds();
    };

    // ✅ Open edit modal
    const openEdit = (sound) => {
        setEditingSound(sound);
        setEditTitle(sound.title);
        setEditFile(null);
        setEditImage(null);
    };

    // ✅ Update sound
    const handleUpdate = async () => {
        if (!editingSound) return;

        const formData = new FormData();
        formData.append("title", editTitle);
        if (editFile) formData.append("sound", editFile);
        if (editImage) formData.append("image", editImage);

        setUpdating(true);
        await axios.put(
            `https://quoteappserver.onrender.com/api/sounds/${editingSound._id}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        setUpdating(false);
        setEditingSound(null);
        fetchSounds();
    };

    return (
        <div className="w-full">
            <Sidebar />
            <div
                className="ml-64 min-h-screen p-6"
                style={{ backgroundColor: COLORS.background }}
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    🎵 Sound Manager
                </h1>

                {/* Upload Form */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Upload New Sound</h2>

                    {/* Title Input */}
                    <label className="block mb-2 text-gray-700 font-medium">Sound Title</label>
                    <input
                        type="text"
                        placeholder="Enter sound title"
                        className="border p-2 w-full mb-4 rounded focus:ring focus:ring-blue-200"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Audio Upload */}
                    <label className="block mb-2 text-gray-700 font-medium flex items-center gap-2">
                        🎵 Audio File
                        <span className="text-sm text-gray-500">(MP3, WAV, etc.)</span>
                    </label>
                    <input
                        type="file"
                        accept="audio/*"
                        className="mb-4 block w-full border p-2 rounded cursor-pointer focus:ring focus:ring-blue-200"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    {/* Image Upload */}
                    <label className="block mb-2 text-gray-700 font-medium flex items-center gap-2">
                        🖼️ Cover Image
                        <span className="text-sm text-gray-500">(JPG, PNG, etc.)</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        className="mb-4 block w-full border p-2 rounded cursor-pointer focus:ring focus:ring-blue-200"
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </div>


                {/* Sound List */}
                <div className="grid md:grid-cols-2 gap-6">
                    {sounds.map((sound) => (
                        <div
                            key={sound._id}
                            className="flex items-center justify-between bg-white p-4 rounded-lg shadow border border-gray-200"
                        >
                            <div className="flex items-center gap-4">
                                {sound.image && (
                                    <img
                                        src={sound.image}
                                        alt={sound.title}
                                        className="w-20 h-20 object-cover rounded-lg border"
                                    />
                                )}

                                <div>
                                    <p className="font-semibold text-gray-700">{sound.title}</p>
                                    <audio
                                        controls
                                        src={sound.url}
                                        className="mt-2 w-56"
                                    ></audio>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEdit(sound)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(sound._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edit Modal */}
                {editingSound && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{
                            backdropFilter: "blur(6px)",
                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Edit Sound</h2>

                            {/* Title */}
                            <label className="block mb-2 text-gray-700 font-medium">Sound Title</label>
                            <input
                                type="text"
                                className="border p-2 w-full mb-4 rounded focus:ring focus:ring-blue-200"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />

                            {/* Audio Upload */}
                            <label className="block mb-2 text-gray-700 font-medium flex items-center gap-2">
                                🎵 Audio File
                                <span className="text-sm text-gray-500">(MP3, WAV, etc.)</span>
                            </label>
                            <input
                                type="file"
                                accept="audio/*"
                                className="mb-4 block w-full border p-2 rounded cursor-pointer focus:ring focus:ring-blue-200"
                                onChange={(e) => setEditFile(e.target.files[0])}
                            />
                            {editFile && <p className="text-sm text-gray-500 mb-2">Selected: {editFile.name}</p>}

                            {/* Image Upload */}
                            <label className="block mb-2 text-gray-700 font-medium flex items-center gap-2">
                                🖼️ Cover Image
                                <span className="text-sm text-gray-500">(JPG, PNG, etc.)</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="mb-4 block w-full border p-2 rounded cursor-pointer focus:ring focus:ring-blue-200"
                                onChange={(e) => setEditImage(e.target.files[0])}
                            />
                            {editImage && (
                                <img
                                    src={URL.createObjectURL(editImage)}
                                    alt="preview"
                                    className="w-32 h-32 object-cover rounded mb-3 border"
                                />
                            )}

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setEditingSound(null)}
                                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    {updating ? "Updating..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
