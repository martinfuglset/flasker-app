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
import FilterSortModal from "@/components/FilterSortModal"; // Importing the FilterSortModal
import { Button } from "@/components/Button";
import { FiFilter } from "react-icons/fi"; // Import filter icon

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [regions, setRegions] = useState([]); // State for regions
  const [showModal, setShowModal] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [filterMode, setFilterMode] = useState(null); // Filter state
  const [sortOrder, setSortOrder] = useState(null); // Sorting state
  const [sortField, setSortField] = useState("name"); // New sorting field state
  const [filterName, setFilterName] = useState(''); // Filter by name state
  const [filterRegion, setFilterRegion] = useState(''); // Filter by region state
  const [filterSistHentet, setFilterSistHentet] = useState(''); // Filter by sist hentet
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

  // Fetch regions from Firestore
  const fetchRegions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "regions")); // Assuming 'regions' is the collection
      const fetchedRegions = querySnapshot.docs.map((docSnapshot) => docSnapshot.data().name); // Assuming each region has a 'name' field
      setRegions(fetchedRegions);
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
    fetchRegions(); // Fetch regions when the component mounts
  }, []);

  // Apply filter and sort functionality based on active settings
  const applyFiltersAndSort = (dataToFilter = data) => {
    let updatedData = [...dataToFilter];

    // Apply sorting
    updatedData.sort((a, b) => {
      const fieldA = a[sortField] ? a[sortField].toString().toLowerCase() : "";
      const fieldB = b[sortField] ? b[sortField].toString().toLowerCase() : "";
      if (sortOrder === "asc") {
        return fieldA.localeCompare(fieldB);
      } else {
        return fieldB.localeCompare(fieldA);
      }
    });

    // Apply filters
    if (filterName) {
      updatedData = updatedData.filter(item =>
        item.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterRegion) {
      updatedData = updatedData.filter(item => item.region === filterRegion);
    }

    if (filterSistHentet) {
      updatedData = updatedData.filter(item => item.sist_hentet === filterSistHentet);
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

  // Apply filter and sort options from modal
  const applyFilterAndSort = (filterSortData) => {
    setSortOrder(filterSortData.sortOrder);
    setSortField(filterSortData.sortField);
    setFilterName(filterSortData.filterName);
    setFilterRegion(filterSortData.filterRegion);
    setFilterSistHentet(filterSortData.filterSistHentet);
    applyFiltersAndSort(); // Reapply filter and sort after applying the modal
  };

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
            className="bg-white hover:bg-gray-100 text-black border border-[0.5px] border-gray-500 w-10 h-10 rounded-full flex items-center justify-center"
          >
            +
          </Button>

          {/* Filter button with modal */}
          <Button
            onClick={() => setShowFilterPopover(true)}
            className="bg-white hover:bg-gray-100 text-black border border-[0.5px] border-gray-500 w-10 h-10 rounded-full flex items-center justify-center"
          >
            <FiFilter /> {/* Display filter icon */}
          </Button>

          {/* FilterSortModal */}
          {showFilterPopover && (
            <FilterSortModal
              show={showFilterPopover}
              onClose={() => setShowFilterPopover(false)}
              onApply={applyFilterAndSort}
              regions={regions} // Pass fetched regions to modal
            />
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
