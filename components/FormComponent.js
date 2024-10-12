// FormComponent.js
import { useState, useEffect } from "react";

const FormComponent = ({ handleSubmit, initialData }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [interval, setInterval] = useState(1);
  const [sistHentet, setSistHentet] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setAddress(initialData.address || "");
      setPhone(initialData.phone || "");
      setRegion(initialData.region || "");
      setInterval(initialData.interval || 1);
      setSistHentet(
        initialData.sist_hentet
          ? new Date(initialData.sist_hentet).toISOString().substr(0, 10)
          : ""
      );
    }
  }, [initialData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit({
      name,
      address,
      phone,
      region,
      interval,
      sist_hentet: sistHentet, // Keep as 'YYYY-MM-DD' string
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Region</label>
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Interval (days)</label>
        <input
          type="number"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          min="1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Last Picked Up Date</label>
        <input
          type="date"
          value={sistHentet}
          onChange={(e) => setSistHentet(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-4">
        Save Changes
      </button>
    </form>
  );
};

export default FormComponent;
