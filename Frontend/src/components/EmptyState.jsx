import React from "react";
import { UserPlus } from "lucide-react";

const EmptyState = ({ onAddContact }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <UserPlus className="h-12 w-12 text-black mb-4" />
      <h3 className="text-lg font-medium text-gray-900">
        No contacts available
      </h3>
      <p className="text-white mb-6 mt-3">Start by adding your first contact.</p>
      <button
        onClick={onAddContact}
        className="px-5 py-2 rounded-lg bg-white text-black hover:bg-blue-700 hover:text-white"
      >
        Add Contact
      </button>
    </div>
  );
};

export default EmptyState;
