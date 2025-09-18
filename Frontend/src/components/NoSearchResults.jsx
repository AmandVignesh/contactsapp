import React from "react";
import { Search, XCircle } from "lucide-react";

const NoSearchResults = ({ searchTerm, onClear }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <Search className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700">No results found</h3>
      <p className="text-gray-500 mb-6">
        We couldn’t find any contacts matching “{searchTerm}”.
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2 flex items-center space-x-2 rounded-lg bg-gray-200 hover:bg-gray-300"
      >
        <XCircle className="h-4 w-4" />
        <span>Clear Search</span>
      </button>
    </div>
  );
};

export default NoSearchResults;
