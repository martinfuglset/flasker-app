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
      // Add a new document to the "submissions" collection
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
      console.error("Error adding document:", error.message); // Log the actual error message
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Firestore Submissions:</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <div className="grid gap-4 mb-8">
        {data.length > 0 ? (
          data.map((item) => (
            <Card key={item.id} className="p-4 shadow-lg">
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Address:</strong> {item.address}</p>
              <p><strong>Phone:</strong> {item.phone}</p>
              <p><strong>Region:</strong> {item.region}</p>
              <p><strong>Interval:</strong> {item.interval}</p>
              <p><strong>Sist Hentet:</strong> {item.sist_hentet}</p>
            </Card>
          ))
        ) : (
          <p>No data found.</p>
        )}
      </div>

      {/* Form for adding new submissions */}
      <h2 className="text-xl font-semibold mb-4">Add a New Submission</h2>
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
        <Button type="submit" className="w-full bg-blue-500 text-white">Submit</Button>
      </form>
    </div>
  );
}
