import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import CardComponent from "@/components/CardComponent";
import FormComponent from "@/components/FormComponent";
import ModalComponent from "@/components/ModalComponent";
import FilterSortModal from "@/components/FilterSortModal";
import { Button } from "@/components/Button";

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilterSortModal, setShowFilterSortModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Define fetchData function so it can be called from anywhere
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

      setData(fetchedData);
      setFilteredData(fetchedData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
      setError("Error fetching data from Firestore. Check console for details.");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterAndSort = (filterName, sortOrder) => {
    let updatedData = [...data];

    // Filter by name
    if (filterName) {
      updatedData = updatedData.filter(item => item.name.toLowerCase().includes(filterName.toLowerCase()));
    }

    // Sort data based on the selected order
    updatedData.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    setFilteredData(updatedData); // Update the filtered data
  };

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    try {
      if (isEditing && currentItem) {
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

      setShowModal(false); // Close the modal after submission
      setIsEditing(false);
      fetchData();  // Refresh data after submission
    } catch (error) {
      console.error("Error saving document:", error.message);
      setError(`Error saving document: ${error.message}`);
      setSuccess(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "submissions", id));
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setFilteredData((prevData) => prevData.filter((item) => item.id !== id)); // Update filtered data
      setSuccess("Document deleted successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
      setError("Error deleting document.");
    }
  };

  const handleEdit = async (formData) => {
    if (currentItem) {
      try {
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
        setShowModal(false); // Close modal after editing
        fetchData(); // Refresh the data
      } catch (error) {
        console.error("Error updating document:", error.message);
        setError(`Error updating document: ${error.message}`);
        setSuccess(null);
      }
    }
  };

  const handleCardClick = (item) => {
    setCurrentItem(item);  // Set the current item to be edited
    setIsEditing(true);    // Indicate that we're in editing mode
    setShowModal(true);    // Show the modal
  };

  const generateGoogleMapsLink = (address) => {
    const query = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="max-w-[390px] mx-auto p-6">
      {/* Top header with title and buttons */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Flasker</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setIsEditing(false);  // Indicate this is a new entry
              setCurrentItem(null);  // Reset current item
              setShowModal(true);    // Show modal for adding new entry
            }}
            className="bg-white text-black border border-gray-500 w-10 h-10 rounded-full flex items-center justify-center"
          >
            +
          </Button>
          <Button
            onClick={() => setShowFilterSortModal(true)}
            className="bg-white text-black border border-gray-500 w-10 h-10 rounded-full flex items-center justify-center"
          >
            ?
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <div className="grid gap-2 mb-8">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <CardComponent
              key={item.id}
              item={item}
              onClickCard={handleCardClick} // Pass callback to handle card click
              handleDelete={handleDelete}
              generateGoogleMapsLink={generateGoogleMapsLink}
            />
          ))
        ) : (
          <p>No data found.</p>
        )}
      </div>

      {/* Modal for adding/updating submissions */}
      {showModal && (
        <ModalComponent
          item={currentItem}
          showModal={showModal}
          handleDelete={handleDelete}
          handleEdit={handleEdit} // Add the correct handleEdit function here
          closeModal={() => setShowModal(false)} // Close modal function
        >
          <FormComponent
            handleSubmit={handleSubmit}
            initialData={isEditing && currentItem ? currentItem : {}}
          />
        </ModalComponent>
      )}

      {/* Filter and Sort Modal */}
      <FilterSortModal
        show={showFilterSortModal}
        onClose={() => setShowFilterSortModal(false)}
        onApply={handleFilterAndSort}
      />
    </div>
  );
}
