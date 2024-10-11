import { useState, useEffect } from "react";

const ModalComponent = ({ item, handleDelete, handleEdit, closeModal }) => {
  // Ensure item is defined before attempting to access properties
  const [formData, setFormData] = useState({
    name: item?.name || '',
    phone: item?.phone || '',
    address: item?.address || '',
    region: item?.region || '',
    interval: item?.interval || '',
    sist_hentet: item?.sist_hentet || '',
  });

  useEffect(() => {
    // When the item prop changes, update the formData accordingly
    if (item) {
      setFormData({
        name: item.name || '',
        phone: item.phone || '',
        address: item.address || '',
        region: item.region || '',
        interval: item.interval || '',
        sist_hentet: item.sist_hentet || '',
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

  if (!item) return null; // If item is not available, don't render the modal

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Card</h2>
        
        {/* Form to edit card */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Region</label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interval</label>
            <input
              type="text"
              name="interval"
              value={formData.interval}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Pick-up</label>
            <input
              type="text"
              name="sist_hentet"
              value={formData.sist_hentet}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={() => handleDelete(item.id)}
          >
            Delete
          </button>
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
                handleEdit(formData);
                closeModal();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
