import React, { useState, useEffect } from "react";
import { Plus, Check, LogOut } from "lucide-react";

import ContactCard from "./ContactCard";
import ContactForm from "./ContactForm";
import SearchFilter from "./SearchFilter";
import Pagination from "./Pagination";
import EmptyState from "./Emptystate";
import NoSearchResults from "./NoSearchResults";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const ContactApp = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const contactsPerPage = 6;

  const filteredContacts = allContacts.filter((contact) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.phone.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const currentContacts = filteredContacts.slice(
    startIndex,
    startIndex + contactsPerPage
  );

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = Cookies.get("jwt_token");
        const response = await fetch("http://localhost:3001/api/contacts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch contacts");

        const data = await response.json();
        setAllContacts(data);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const saveContact = (contactData) => {
    setAllContacts((prevContacts) => {
        const exists = prevContacts.some((c) => c._id === contactData._id);
        if (exists) {
        return prevContacts.map((c) =>
            c._id === contactData._id ? contactData : c
        );
        } else {
        return [...prevContacts, contactData];
        }
    });
    showNotification(contactData._id ? "Contact updated successfully!" : "Contact added successfully!");
    closeForm();
};


  const deleteContact = async (contactId) => {
    try {
      const token = Cookies.get("jwt_token");
      setDeletingIds((prev) => new Set([...prev, contactId]));

      const response = await fetch(
        `http://localhost:3001/api/contacts/${contactId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete contact");

      setAllContacts((prev) =>
        prev.filter((contact) => contact._id !== contactId)
      );

      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(contactId);
        return newSet;
      });

      showNotification("Contact deleted successfully!");
    } catch (err) {
      console.error("Error deleting contact:", err);
      showNotification("Failed to delete contact", "error");
    }
  };

  const editContact = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const addNewContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-500 transform ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5" />
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl p-2 font-serif font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Contact Manager
            </h1>
            <p className="text-gray-600 font-semibold mt-2 text-lg">Organize and manage your contacts efficiently</p>
          </div>
          <div className="flex gap-6 items-center">
              <button
                onClick={addNewContact}
                className="w-full sm:w-auto flex items-center justify-center gap-2 
                            px-4 py-2 
                            text-sm sm:text-base md:text-lg font-semibold 
                            text-white rounded-lg 
                            bg-gradient-to-r from-blue-600 to-purple-600 
                            hover:from-blue-700 hover:to-purple-700 
                            focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 
                            shadow-md hover:shadow-lg transition transform hover:scale-105"
                >

                <Plus className="w-5 h-7" />
                <span className="hidden md:block">Add Contact</span>
                
                </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 inline-flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <LogOut className="h-5 w-4" />
                <span className="hidden md:block">Logout</span>
                </button>
          </div>
          
        </div>

        {allContacts.length > 0 && (
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            contactCount={filteredContacts.length}
          />
        )}

        {allContacts.length === 0 && <EmptyState onAddContact={addNewContact} />}

        {allContacts.length > 0 &&
          filteredContacts.length === 0 &&
          searchTerm && (
            <NoSearchResults searchTerm={searchTerm} onClear={() => setSearchTerm("")} />
          )}

        {filteredContacts.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentContacts.map((contact) => (
                <ContactCard
                  key={contact._id}
                  contact={contact}
                  onEdit={editContact}
                  onDelete={deleteContact}
                  isDeleting={deletingIds.has(contact._id)}
                  
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {showForm && (
          <ContactForm
            contact={editingContact}
            onSave={saveContact}
            onClose={closeForm}
          />
        )}
        <p className="text-gray-600 mt-2 text-lg text-end">
              {allContacts.length > 0
                ? `${allContacts.length} contact${
                    allContacts.length !== 1 ? "s" : ""
                  }`
                : ""}
              {searchTerm &&
                filteredContacts.length !== allContacts.length &&
                ` (${filteredContacts.length} matching search)`}
            </p>
      </div>
    </div>
  );
};

export default ContactApp;
