// ModalComponent.js
import React from "react";

const ModalComponent = ({ item, showModal, handleDelete, closeModal, children }) => {
  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {item ? "Edit Contact" : "Add New Contact"}
        </h2>

        {/* Render the FormComponent passed as children */}
        {children}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {item && (
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          )}
          <div className="space-x-2">
            <button
              className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
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
