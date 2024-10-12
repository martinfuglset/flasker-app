// index.js
import { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
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
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [filterMode, setFilterMode] = useState(null); // Filter state
  const [sortOrder, setSortOrder] = useState(null); // Sorting state
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const popoverRef = useRef(null); // Ref for the popover

  // Fetch data from Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "submissions"));
      const fetchedData = querySnapshot.docs.map((docSnapshot) => {
        const docData = docSnapshot.data();
        if (docData.sist_hentet && docData.sist_hentet.toDate) {
          docData.sist_hentet = docData.sist_hentet
            .toDate()
            .toISOString()
            .split("T")[0];
        }
        return { id: docSnapshot.id, ...docData };
      });

      setData(fetchedData);

      // After fetching data, reapply any filters that are active
      applyFiltersAndSort(fetchedData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  // Apply filter and sort functionality based on active settings
  const applyFiltersAndSort = (dataToFilter = data) => {
    let updatedData = [...dataToFilter];

    // Apply sort
    if (sortOrder) {
      updatedData.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortOrder === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }

    // Apply filters
    if (filterMode === "må_hentes") {
      updatedData = updatedData.filter((item) => {
        const daysDifference = Math.floor(
          (new Date().getTime() - new Date(item.sist_hentet).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return daysDifference >= item.interval;
      });
    } else if (filterMode === "må_ikke_hentes") {
      updatedData = updatedData.filter((item) => {
        const daysDifference = Math.floor(
          (new Date().getTime() - new Date(item.sist_hentet).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return daysDifference < item.interval;
      });
    }

    setFilteredData(updatedData); // Update the filtered data
  };

  // Handle form submission for add/edit
  const handleSubmit = async (formData) => {
    try {
      // Convert 'sist_hentet' from 'YYYY-MM-DD' string to Timestamp
      const formattedSistHentet = formData.sist_hentet
        ? Timestamp.fromDate(new Date(formData.sist_hentet))
        : null;

      if (isEditing && currentItem) {
        // Update an existing submission
        const docRef = doc(db, "submissions", currentItem.id);
        await updateDoc(docRef, {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          region: formData.region,
          interval: parseInt(formData.interval),
          sist_hentet: formattedSistHentet, // Use Timestamp
        });
      } else {
        // Add a new submission
        await addDoc(collection(db, "submissions"), {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          region: formData.region,
          interval: parseInt(formData.interval),
          sist_hentet: formattedSistHentet, // Use Timestamp
        });
      }

      setShowModal(false); // Close the modal after submission
      setIsEditing(false);
      await fetchData(); // Refresh data to reflect the changes
    } catch (error) {
      console.error("Error saving document:", error.message);
    }
  };

  // Handle deletion of a submission
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "submissions", id));
      await fetchData(); // Refresh data after deletion
      setShowModal(false); // Close modal after deletion
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleCardClick = (item) => {
    setCurrentItem(item); // Set the current item to be edited
    setIsEditing(true); // Indicate that we're in editing mode
    setShowModal(true); // Show the modal
  };

  // Function to toggle popover visibility
  const togglePopover = () => {
    setShowFilterPopover(!showFilterPopover);
  };

  // Apply filter and sort options from popover
  const applyFilterAndSort = () => {
    applyFiltersAndSort();
    setShowFilterPopover(false); // Close popover after applying
  };

  // Reset the filter (show all)
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
              setIsEditing(false); // Indicate this is a new entry
              setCurrentItem(null); // Reset current item
              setShowModal(true); // Show modal for adding new entry
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
            <div
              ref={popoverRef}
              className="absolute top-12 right-0 z-10 bg-white shadow-lg border border-gray-300 rounded-md w-48 p-4"
            >
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
