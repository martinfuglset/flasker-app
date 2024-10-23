import React, { useState } from 'react';
import { Button } from "@/components/Button";

const FilterSortModal = ({ show, onClose, onApply, regions }) => {
  const [filterName, setFilterName] = useState('');
  const [filterRegion, setFilterRegion] = useState(''); // New filter for region
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order
  const [sortField, setSortField] = useState('name'); // Default sorting by name
  const [filterSistHentet, setFilterSistHentet] = useState(''); // New filter for sist hentet

  const handleApply = () => {
    // Passing multiple filter and sort criteria
    onApply({
      filterName,
      filterRegion,
      filterSistHentet,
      sortOrder,
      sortField,
    });
    onClose();
  };

  if (!show) return null; // Don't render if not shown

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Filter and Sort</h2>

        {/* Filter by Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Filter by Name:</label>
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Filter by Region */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Filter by Region:</label>
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Sist Hentet */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Filter by Sist Hentet:</label>
          <input
            type="date"
            value={filterSistHentet}
            onChange={(e) => setFilterSistHentet(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Sort Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Sort By:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="name">Name</option>
            <option value="region">Region</option>
            <option value="sistHentet">Sist Hentet</option>
          </select>
        </div>

        {/* Sort Order */}
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

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <Button className="bg-gray-200 text-black" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 text-white" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSortModal;
