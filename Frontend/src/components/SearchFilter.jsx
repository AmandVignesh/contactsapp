import React from "react";
import { X } from "lucide-react";

const SearchFilter = ({ searchTerm, onSearchChange, contactCount }) => {
  return (
    <div className="flex items-center ">
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search contacts..."
        className="flex-1 p-2 md:p-3 border rounded-lg outline-none"
      />
      <p className="ml-3 text-gray-600 hidden md:block">{contactCount} result(s)</p>
    </div>
  );
};

export default SearchFilter;
