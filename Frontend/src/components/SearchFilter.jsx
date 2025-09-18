import React from "react";
import { X } from "lucide-react";

const SearchFilter = ({ searchTerm, onSearchChange, onClear, contactCount }) => {
  return (
    <div className="flex items-center mb-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search contacts..."
        className="flex-1 p-3 border rounded-l-lg outline-none"
      />
      {searchTerm && (
        <button
          onClick={onClear}
          className="bg-gray-200 border  px-3 rounded-r-lg"
        >
          <X className="h-12 w-5" />
        </button>
      )}
      <span className="ml-3 text-gray-600">{contactCount} result(s)</span>
    </div>
  );
};

export default SearchFilter;
