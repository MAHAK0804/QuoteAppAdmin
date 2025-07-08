import React from "react";

const Modal = ({ open, onClose, onSave, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn border border-gray-100">
        {children}
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#a32d2d] transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
