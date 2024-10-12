// ModalComponent.js
import React, { useEffect, useState } from "react";

const ModalComponent = ({ item, showModal, handleDelete, closeModal, children }) => {
  const [visible, setVisible] = useState(showModal);

  useEffect(() => {
    if (showModal) {
      setVisible(true);
    } else {
      // Wait for the animation to complete before unmounting
      const timeoutId = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [showModal]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        showModal ? "opacity-100 bg-black bg-opacity-50" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-6 rounded-md shadow-lg w-96 transform transition-all duration-300 ${
          showModal ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">
          {item ? "Edit Contact" : "Add New Contact"}
        </h2>

        {/* Render the FormComponent passed as children */}
        {children}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {item && (
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          )}
          <div className="space-x-2">
            <button
              className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
