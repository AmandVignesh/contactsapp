import React from "react";
import { UserPlus } from "lucide-react";

const EmptyState = ({ onAddContact }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <UserPlus className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700">
        No contacts available
      </h3>
      <p className="text-gray-500 mb-6">Start by adding your first contact.</p>
      <button
        onClick={onAddContact}
        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Add Contact
      </button>
    </div>
  );
};

export default EmptyState;
