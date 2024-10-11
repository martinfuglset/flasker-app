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
      // Populate the form fields with the item's current data
      setFormData({
        name: item.name || '',
        phone: item.phone || '',
        address: item.address || '',
        region: item.region || '',
        interval: item.interval || '',
        sist_hentet: item.sist_hentet || '',
      });
    } else {
      // Reset the form data when no item is selected
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

  const handleSubmit = () => {
    handleEdit(formData); // Pass updated form data to the parent
    closeModal(); // Close the modal after saving
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{item ? "Edit Card" : "Add New Customer"}</h2>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Region</label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interval</label>
            <input
              type="text"
              name="interval"
              value={formData.interval}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

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
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={handleSubmit}
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
