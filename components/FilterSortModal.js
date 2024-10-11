import React, { useState } from 'react';
import { Button } from "@/components/Button";

const FilterSortModal = ({ show, onClose, onApply }) => {
  const [filterName, setFilterName] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order

  const handleApply = () => {
    onApply(filterName, sortOrder);
    onClose();
  };

  if (!show) return null; // Don't render if not shown

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Filter and Sort</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Filter by Name:</label>
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Sort Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            className="bg-gray-200 text-black"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSortModal;
