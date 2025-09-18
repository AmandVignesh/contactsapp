import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const ContactCard = ({
  contact = { _id: null, name: "", email: "", phone: "", isNew: false },
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const [justAdded, setJustAdded] = useState(contact.isNew);

  useEffect(() => {
    if (contact.isNew) {
      const timer = setTimeout(() => setJustAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [contact.isNew]);

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-5 border transition-all duration-300 transform hover:scale-[1.02] ${
        justAdded ? "border-green-400 ring-2 ring-green-300" : "border-gray-200"
      } ${isDeleting ? "opacity-50" : ""}`}
    >
      <h3 className="text-xl font-semibold text-gray-800">{contact.name}</h3>
      <p className="text-gray-600">{contact.email}</p>
      <p className="text-gray-600">{contact.phone}</p>

      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={() => onEdit(contact)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Pencil className="h-5 w-5" />
        </button>

        <button
          onClick={() => onDelete(contact._id)}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
