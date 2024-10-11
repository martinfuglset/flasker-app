import { useEffect, useState, useRef } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import CardComponent from "@/components/CardComponent";
import FormComponent from "@/components/FormComponent";
import ModalComponent from "@/components/ModalComponent";
import { Button } from "@/components/Button";
import { FiFilter } from "react-icons/fi"; // Import filter icon

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false); // New state for popover visibility
  const [filterMode, setFilterMode] = useState(null); // Filter state ("Må hentes", "Må ikke hentes", or null for no filter)
  const [sortOrder, setSortOrder] = useState(null); // Sorting state (asc or desc by name)
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const popoverRef = useRef(null); // Ref for the popover

  // Define fetchData function so it can be called from anywhere
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "submissions"));
      const fetchedData = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        if (docData.sist_hentet && docData.sist_hentet.seconds) {
          docData.sist_hentet = new Date(docData.sist_hentet.seconds * 1000).toISOString().split('T')[0]; // Ensure consistent YYYY-MM-DD format
        }
        return { id: doc.id, ...docData };
      });
  
      setData(fetchedData);
      setFilteredData(fetchedData); // Initialize the filtered data
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    }
  };
  

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort functionality
  const handleFilterAndSort = () => {
    let updatedData = [...data];

    // Sort data based on the selected order
    if (sortOrder) {
      updatedData.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortOrder === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }

    // Apply "Må hentes" or "Må ikke hentes" filtering
    if (filterMode === "må_hentes") {
      updatedData = updatedData.filter((item) => {
        const daysDifference = Math.floor((new Date().getTime() - new Date(item.sist_hentet).getTime()) / (1000 * 60 * 60 * 24));
        return daysDifference >= item.interval;
      });
    } else if (filterMode === "må_ikke_hentes") {
      updatedData = updatedData.filter((item) => {
        const daysDifference = Math.floor((new Date().getTime() - new Date(item.sist_hentet).getTime()) / (1000 * 60 * 60 * 24));
        return daysDifference < item.interval;
      });
    }

    setFilteredData(updatedData); // Update the filtered data
  };

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    try {
      if (isEditing && currentItem) {
        // Update an existing submission
        const docRef = doc(db, "submissions", currentItem.id);
        await updateDoc(docRef, {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          region: formData.region,
          interval: parseInt(formData.interval),
          sist_hentet: formData.sist_hentet, // Update the last picked up date
        });
      } else {
        // Add a new submission
        await addDoc(collection(db, "submissions"), {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          region: formData.region,
          interval: parseInt(formData.interval),
          sist_hentet: formData.sist_hentet, // Set the last picked up date
        });
      }
  
      setShowModal(false); // Close the modal after submission
      setIsEditing(false);
      fetchData(); // Refresh data after submission
    } catch (error) {
      console.error("Error saving document:", error.message);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "submissions", id));
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setFilteredData((prevData) => prevData.filter((item) => item.id !== id)); // Update filtered data
    } catch (error) {
      console.error("Error deleting document:", error);
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
          sist_hentet: formData.sist_hentet ? new Date(formData.sist_hentet) : null, // Convert string to Date
        });
        setShowModal(false); // Close modal after editing
        fetchData(); // Refresh the data
      } catch (error) {
        console.error("Error updating document:", error.message);
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

  // Function to toggle popover visibility
  const togglePopover = () => {
    setShowFilterPopover(!showFilterPopover);
  };

  // Function to apply filter and sort options from popover
  const applyFilterAndSort = () => {
    handleFilterAndSort();
    setShowFilterPopover(false); // Close popover after applying
  };

  // Function to reset the filter (show all)
  const resetFilter = () => {
    setFilterMode(null); // Remove the filter mode
    setFilteredData(data); // Reset to show all data
    setShowFilterPopover(false); // Close popover
  };

  // Close popover if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowFilterPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef]);

  return (
    <div className="max-w-[390px] mx-auto p-6">
      {/* Top header with title and buttons */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Flasker</h1>
        <div className="flex space-x-2 relative">
          <Button
            onClick={() => {
              setIsEditing(false);  // Indicate this is a new entry
              setCurrentItem(null);  // Reset current item
              setShowModal(true);    // Show modal for adding new entry
            }}
            className="bg-white text-black border border-[0.5px] border-gray-500 w-10 h-10 rounded-full flex items-center justify-center"
          >
            +
          </Button>

          {/* Filter button with popover */}
          <Button
            onClick={togglePopover}
            className="bg-white text-black border border-[0.5px] border-gray-500 w-10 h-10 rounded-full flex items-center justify-center"
          >
            <FiFilter /> {/* Display filter icon */}
          </Button>

          {/* Popover for filtering and sorting */}
          {showFilterPopover && (
            <div ref={popoverRef} className="absolute top-12 right-0 z-10 bg-white shadow-lg border border-gray-300 rounded-md w-48 p-4">
              <div>
                <p className="font-medium mb-2">Sort by</p>
                <select
                  className="w-full border-gray-300 rounded mb-4 p-2"
                  onChange={(e) => setSortOrder(e.target.value)}
                  value={sortOrder || ""}
                >
                  <option value="">None</option>
                  <option value="asc">Name (A-Z)</option>
                  <option value="desc">Name (Z-A)</option>
                </select>

                <p className="font-medium mb-2">Filter</p>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="filter"
                      className="mr-2"
                      checked={filterMode === "må_hentes"}
                      onChange={() => setFilterMode("må_hentes")}
                    />
                    Må hentes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="filter"
                      className="mr-2"
                      checked={filterMode === "må_ikke_hentes"}
                      onChange={() => setFilterMode("må_ikke_hentes")}
                    />
                    Må ikke hentes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="filter"
                      className="mr-2"
                      checked={filterMode === null}
                      onChange={resetFilter}
                    />
                    Show All
                  </label>
                </div>

                <Button
                  onClick={applyFilterAndSort}
                  className="w-full bg-blue-500 text-white py-2 rounded"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
}
