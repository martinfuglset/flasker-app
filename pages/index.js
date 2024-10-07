// pages/index.js
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // Adjust the path to your firebase config
import { Button } from "@/components/ui/button";  // Adjust based on the actual path
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    region: '',
    interval: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);  // New state to control modal visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "submissions"));
        const fetchedData = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          if (docData.sist_hentet && docData.sist_hentet.seconds) {
            docData.sist_hentet = new Date(docData.sist_hentet.seconds * 1000).toLocaleString();
          }
          return {
            id: doc.id,
            ...docData,
          };
        });
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
        setError("Error fetching data from Firestore. Check console for details.");
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "submissions"), {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        region: formData.region,
        interval: parseInt(formData.interval), // Convert interval to a number
        sist_hentet: new Date(), // Use current date/time as sist_hentet
      });

      setSuccess("New submission added successfully!");
      setFormData({ name: '', address: '', phone: '', region: '', interval: '' }); // Reset the form
      setError(null);
      setShowModal(false);  // Close modal after submission

      // Refresh the data after submission
      const querySnapshot = await getDocs(collection(db, "submissions"));
      const newData = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        if (docData.sist_hentet && docData.sist_hentet.seconds) {
          docData.sist_hentet = new Date(docData.sist_hentet.seconds * 1000).toLocaleString();
        }
        return {
          id: doc.id,
          ...docData,
        };
      });
      setData(newData);
    } catch (error) {
      console.error("Error adding document:", error.message);
      setError(`Error adding document: ${error.message}`);
      setSuccess(null);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateGoogleMapsLink = (address) => {
    const query = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Flasker</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <div className="grid gap-2 mb-8">
        {data.length > 0 ? (
          data.map((item) => (
            <Card key={item.id} className="p-4 flex items-center space-x-3">
              {/* Placeholder for profile picture */}
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <img 
                  src="https://via.placeholder.com/150" // Replace with actual profile picture URL if available
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover"
                />
              </div>

              {/* Contact information */}
              <div className="flex-grow">
                <p className="text-md font-semibold">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.phone}</p>
                <a
                  href={generateGoogleMapsLink(item.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  {item.address}
                </a>
                <p className="text-gray-500 text-xs"><strong>Region:</strong> {item.region}</p>
                <p className="text-gray-500 text-xs"><strong>Interval:</strong> {item.interval} days</p>
                <p className="text-gray-400 text-xs"><strong>Last Pick-up:</strong> {item.sist_hentet}</p>
              </div>
            </Card>
          ))
        ) : (
          <p>No data found.</p>
        )}
      </div>

      {/* Button to open the modal */}
      <Button onClick={() => setShowModal(true)} className="bg-black text-white mb-4">
        Legg til ny kunde
      </Button>

      {/* Modal for adding new submissions */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Legg til ny kunde</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name:</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address:</label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone:</label>
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Region:</label>
                <Input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interval:</label>
                <Input
                  type="number"
                  name="interval"
                  value={formData.interval}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="flex justify-between items-center">
                <Button type="submit" className="bg-black text-white">Submit</Button>
                <Button onClick={() => setShowModal(false)} className="bg-white text-black border">Close</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
