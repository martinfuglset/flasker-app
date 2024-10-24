import { BsFillGeoAltFill, BsFillTelephoneFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // Import Firebase instance

const CardComponent = ({ item, onClickCard, handleDelete, generateGoogleMapsLink, fetchData }) => {
  const [isHentetToday, setIsHentetToday] = useState(false);
  const [previousSistHentet, setPreviousSistHentet] = useState(null); // Store previous sist_hentet
  const [mustBePickedUp, setMustBePickedUp] = useState(false); // New state to determine if it should be picked up

  // Function to check if sist_hentet is today
  const checkIfHentetToday = () => {
    if (!item.sist_hentet) return false; // Handle if sist_hentet is null or undefined
    const today = new Date();
    const hentetDate = new Date(item.sist_hentet);

    // Compare if both dates are the same day (ignoring time)
    return (
      hentetDate.getDate() === today.getDate() &&
      hentetDate.getMonth() === today.getMonth() &&
      hentetDate.getFullYear() === today.getFullYear()
    );
  };

  // Function to check if item must be picked up (based on interval)
  const checkIfMustBePickedUp = () => {
    if (!item.sist_hentet || !item.interval) return false;

    const today = new Date();
    const hentetDate = new Date(item.sist_hentet);

    // Calculate the difference in days
    const timeDifference = today.getTime() - hentetDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    return daysDifference >= item.interval;
  };

  useEffect(() => {
    setIsHentetToday(checkIfHentetToday());
    setPreviousSistHentet(item.sist_hentet); // Set the initial previous sist_hentet when the component mounts
    setMustBePickedUp(checkIfMustBePickedUp()); // Set must be picked up state
  }, [item.sist_hentet, item.interval]);

  // Function to toggle between "Hentet Today" and the previous sist_hentet
  const toggleHentet = async () => {
    try {
      const today = new Date();

      if (isHentetToday) {
        // Revert to previous sist_hentet if the item was marked as "Hentet Today"
        const docRef = doc(db, "submissions", item.id);
        await updateDoc(docRef, {
          sist_hentet: previousSistHentet, // Revert to the previous date
        });

        // Update local state
        item.sist_hentet = previousSistHentet;
        setIsHentetToday(false); // Now it is not marked as "Hentet Today"
      } else {
        // Store the current sist_hentet before marking as today
        setPreviousSistHentet(item.sist_hentet);

        // Mark the item as "Hentet Today"
        const docRef = doc(db, "submissions", item.id);
        await updateDoc(docRef, {
          sist_hentet: today,
        });

        // Update local state
        item.sist_hentet = today;
        setIsHentetToday(true); // Now it is marked as "Hentet Today"
      }

      // Optional: Fetch updated data from Firestore (refresh the list)
      fetchData();
    } catch (error) {
      console.error("Error updating sist_hentet:", error);
    }
  };

  // Format sist_hentet safely
  const formatSistHentet = (sist_hentet) => {
    if (!sist_hentet) return 'Not Available'; // Handle null or undefined
    const date = new Date(sist_hentet);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString(); // Show only the date
  };

  return (
    <div
      key={item.id}
      className="p-4 flex flex-col space-y-6 relative bg-gray-50 rounded-3xl cursor:pointer hover:bg-gray-100"
      onClick={() => onClickCard(item)} // Trigger callback to open the modal
    >
      {/* Row for Name, Phone, and Maps */}
      <div className="flex items-center justify-between">
        {/* Name */}
        <p className="text-md">{item.name}</p>

        {/* Buttons for Phone and Maps */}
        <div className="flex items-center space-x-2">
          {/* Phone button */}
          <button
            className="p-2 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 border border-[0.5px] border-gray-500"
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal from opening when this button is clicked
              window.location.href = `tel:${item.phone}`;
            }}
          >
            <BsFillTelephoneFill />
          </button>

          {/* Maps button */}
          <button
            className="p-2 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 border border-[0.5px] border-gray-500"
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal from opening when this button is clicked
              window.open(generateGoogleMapsLink(item.address), '_blank');
            }}
          >
            <BsFillGeoAltFill />
          </button>
        </div>
      </div>

      {/* Additional Information */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-gray-500 text-xs">{item.region}</p>
          {/* Conditional styling for "må hentes" and "må ikke hentes" */}
          <p
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
              mustBePickedUp
                ? 'text-red-600 bg-red-100'  // Red text and light red background for "Må hentes"
                : 'text-gray-700 bg-gray-100' // Gray text and light gray background for "Må ikke hentes"
            }`}
          >
            {mustBePickedUp ? "Må hentes" : "Må ikke hentes"}
          </p>
          <p className="text-gray-400 text-xs">Sist hentet: {formatSistHentet(item.sist_hentet)}</p>
        </div>

        <button
          className={`px-4 py-2 rounded-full border-[0.5px] text-sm font-medium transition-colors duration-200 ${
            isHentetToday
              ? 'text-green-600 border-green-600' // Green text and border if Hentet
              : 'text-gray-500 border-gray-500'   // Gray text and border if Ikke hentet
          }`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent modal from opening when this button is clicked
            toggleHentet(); // Toggle hentet status
          }}
        >
          {isHentetToday ? 'Hentet ●' : 'Ikke hentet ○'}
        </button>
      </div>
    </div>
  );
};

export default CardComponent;
