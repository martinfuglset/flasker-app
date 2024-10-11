// components/ModalComponent.js
import { useState, useEffect } from "react";

const ModalComponent = ({ item, showModal, handleDelete, handleEdit, closeModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    region: '',
    interval: '',
    sist_hentet: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        phone: item.phone || '',
        address: item.address || '',
        region: item.region || '',
        interval: item.interval || '',
        sist_hentet: item.sist_hentet || '',
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        address: '',
        region: '',
        interval: '',
        sist_hentet: '',
      });
    }
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{item ? "Edit Card" : "Add New Customer"}</h2>
        
        <div className="space-y-4">
          {/* Input fields for form data */}
          {/* (Inputs go here as defined previously) */}
        </div>

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
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={() => {
                handleEdit(formData); // Pass the formData to handleEdit
                closeModal();
              }}
            >
              {item ? "Save" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
