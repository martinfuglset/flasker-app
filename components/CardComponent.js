import { useState } from "react";
import { Button } from "@/components/Button";
import { BsThreeDotsVertical, BsFillGeoAltFill, BsFillTelephoneFill } from "react-icons/bs";
import ModalComponent from './ModalComponent'; // Import the modal

const CardComponent = ({ item, handleDelete, handleEdit, generateGoogleMapsLink }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div key={item.id} className="p-4 flex flex-col space-y-2 relative bg-gray-50 rounded-3xl">
      {/* Row for Name, Phone, Maps, and Three Dots */}
      <div className="flex items-center justify-between">
        {/* Name on the left */}
        <p className="text-md font-semibold">{item.name}</p>

        {/* Buttons on the right */}
        <div className="flex items-center space-x-4">
          {/* Phone button */}
          <button
            className="p-2 bg-gray-200 rounded-full flex items-center justify-center text-black hover:bg-gray-300"
            onClick={() => window.location.href = `tel:${item.phone}`}
          >
            <BsFillTelephoneFill />
          </button>

          {/* Maps button */}
          <button
            className="p-2 bg-gray-200 rounded-full flex items-center justify-center text-black hover:bg-gray-300"
            onClick={() => window.open(generateGoogleMapsLink(item.address), '_blank')}
          >
            <BsFillGeoAltFill />
          </button>

          {/* Three dots button */}
          <Button
            className="p-2 bg-gray-200 rounded-full flex items-center justify-center text-black hover:bg-gray-300"
            onClick={() => setShowModal(true)}
          >
            <BsThreeDotsVertical />
          </Button>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <p className="text-gray-500 text-xs">
          <strong>Region:</strong> {item.region}
        </p>
        <p className="text-gray-500 text-xs">
          <strong>Interval:</strong> {item.interval} days
        </p>
        <p className="text-gray-400 text-xs">
          <strong>Last Pick-up:</strong> {item.sist_hentet}
        </p>
      </div>

      {/* Show Modal */}
      {showModal && (
        <ModalComponent
          item={item}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          closeModal={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CardComponent;
