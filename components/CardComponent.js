// components/CardComponent.js
import { useState } from "react";
import { Button } from "@/components/button";
import { BsThreeDotsVertical } from "react-icons/bs";

const CardComponent = ({ item, handleDelete, handleEdit, generateGoogleMapsLink }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div key={item.id} className="p-4 flex items-center space-x-3 relative">
      {/* Placeholder for profile picture */}
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
        <img
          src="https://via.placeholder.com/150"
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

      {/* Three dots button to trigger dropdown */}
      <div className="relative">
        <Button
          className="p-2"
          onClick={() => setShowMenu(!showMenu)}
        >
          <BsThreeDotsVertical />
        </Button>

        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute right-0 bg-white border rounded shadow-md">
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setShowMenu(false);
                handleEdit(item); // Call handleEdit with the item data
              }}
            >
              Edit
            </button>
            <button
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={() => {
                setShowMenu(false);
                handleDelete(item.id); // Call handleDelete with the item ID
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardComponent;
