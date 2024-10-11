import { useState } from 'react';

const FormComponent = ({ handleSubmit, initialData }) => {
  const [name, setName] = useState(initialData.name || '');
  const [address, setAddress] = useState(initialData.address || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [region, setRegion] = useState(initialData.region || '');
  const [interval, setInterval] = useState(initialData.interval || 1);
  const [sistHentet, setSistHentet] = useState(
    initialData.sist_hentet
      ? new Date(initialData.sist_hentet).toISOString().substr(0, 10)
      : ''
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e, {
      name,
      address,
      phone,
      region,
      interval,
      sist_hentet: new Date(sistHentet), // Convert the selected date to Date object
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label>Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label>Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label>Region</label>
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label>Interval (days)</label>
        <input
          type="number"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label>Last Picked Up Date</label>
        <input
          type="date"
          value={sistHentet}
          onChange={(e) => setSistHentet(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Save Changes
      </button>
    </form>
  );
};

export default FormComponent;
