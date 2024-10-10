// pages/index.js
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import CardComponent from "@/components/CardComponent";
import FormComponent from "@/components/FormComponent";
import ModalComponent from "@/components/ModalComponent";
import { Button } from "@/components/button";

export default function Home() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);  // New state to track editing
  const [currentItem, setCurrentItem] = useState(null);  // New state to store the card being edited

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "submissions"));
        const fetchedData = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          if (docData.sist_hentet && docData.sist_hentet.seconds) {
            docData.sist_hentet = new Date(docData.sist_hentet.seconds * 1000).toLocaleString();
          }
          return { id: doc.id, ...docData };
        });

        const sortedData = fetchedData.sort((a, b) => {
          const nameA = a.name.split(" ")[0].toLowerCase();
          const nameB = b.name.split(" ")[0].toLowerCase();
          return nameA.localeCompare(nameB);
        });

        setData(sortedData);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
        setError("Error fetching data from Firestore. Check console for details.");
      }
    };

    fetchData();
  }, []);

  // Handle form submission for adding or updating
  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    try {
      if (isEditing && currentItem) {
        // Update existing document
        const docRef = doc(db, "submissions", currentItem.id);
        await updateDoc(docRef, {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          region: formData.region,
          interval: parseInt(formData.interval),
          sist_hentet: new Date(),
        });
        setSuccess("Submission updated successfully!");
      } else {
        // Add new document
        await addDoc(collection(db, "submissions"), {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          region: formData.region,
          interval: parseInt(formData.interval),
          sist_hentet: new Date(),
        });
        setSuccess("New submission added successfully!");
      }

      setShowModal(false);
      setIsEditing(false);
      fetchData();  // Refresh data after submission
    } catch (error) {
      console.error("Error saving document:", error.message);
      setError(`Error saving document: ${error.message}`);
      setSuccess(null);
    }
  };

  // Handle card deletion
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "submissions", id));
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setSuccess("Document deleted successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
      setError("Error deleting document.");
    }
  };

  // Handle card editing
  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    setShowModal(true);
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
            <CardComponent
              key={item.id}
              item={item}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              generateGoogleMapsLink={generateGoogleMapsLink}
            />
          ))
        ) : (
          <p>No data found.</p>
        )}
      </div>

      {/* Button to open the modal for adding new submission */}
      <Button onClick={() => {
        setIsEditing(false);
        setCurrentItem(null);
        setShowModal(true);
      }} className="bg-black text-white mb-4">
        Legg til ny kunde
      </Button>

      {/* Modal for adding/updating submissions */}
      <ModalComponent showModal={showModal} setShowModal={setShowModal}>
        <FormComponent
          handleSubmit={handleSubmit}
          initialData={isEditing && currentItem ? currentItem : {}} // Pre-fill form if editing
        />
      </ModalComponent>
    </div>
  );
}
