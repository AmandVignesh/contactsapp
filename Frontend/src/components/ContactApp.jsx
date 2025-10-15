import React, { useState, useEffect } from "react";
import { Plus, Check, LogOut , X} from "lucide-react";
import Loading from "./Loading";
import ContactCard from "./ContactCard";
import ContactForm from "./ContactForm";
import SearchFilter from "./SearchFilter";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
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
  const [loading, setLoading] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate();
  const contactsPerPage = 6;
  const user_details = Cookies.get("existing_user")
  let user_details1 = null
  if(user_details){
     user_details1 = JSON.parse(user_details)
  }
  const two_words_name = user_details1.username
  const intials = two_words_name.split(" ").map(word => word[0]).join("").toUpperCase()
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

  const fetchContacts = async () => {
      try {
        const token = Cookies.get("jwt_token");
        const response = await fetch("https://contactapp-6siq.onrender.com/api/contacts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch contacts");

        const data = await response.json();
        setAllContacts(data);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
      setLoading(false)
    };

  useEffect(() => {
    setLoading(true)
    

    fetchContacts();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const saveContact = (contactData) => {
    setAllContacts((prev) => {
      const exists = prev.some((c) => c._id === contactData._id);
      return exists
        ? prev.map((c) => (c._id === contactData._id ? contactData : c))
        : [...prev, contactData];
    });

    showNotification(
      editingContact
        ? "Contact updated successfully!"
        : "Contact added successfully!"
    );
    closeForm();
  };



  const deleteContact = async (contactId) => {
    try {
      const token = Cookies.get("jwt_token");
      setDeletingIds((prev) => new Set([...prev, contactId]));

      const response = await fetch(
        `https://contactapp-6siq.onrender.com/api/contacts/${contactId}`,
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
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-500 transform ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type==="success"? <Check  className="h-5 w-5"/> : <X className="h-5 w-5"/> }
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col  mb-8 bg-white p-5 rounded-lg"  onMouseLeave={()=>setIsProfileOpen(false)}>
          <div className="flex items-center justify-between">
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

                <div className="flex rounded-sm items-center space-x-4">
                  <div className="relative">
                    <button onMouseEnter={()=>setIsProfileOpen(true)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="bg-blue-500 h-[40px] w-[40px] rounded-[20px] flex items-center justify-center"><p className="text-white">{intials}</p></div>
                      <div className="text-lg font-medium text-gray-900"><p className="font-serif">{user_details1.username}</p></div>
                    </button>
                  </div>
                  {isProfileOpen && (
                      <div className="absolute right-8 top-18 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
                        <div className="px-4 py-3 border-b border-gray-200">
                          <h1 className="text-xl">{user_details1.username}</h1>
                          <h1 className="text-lg">{user_details1.email}</h1>
                        </div>
                        <div className="border-t border-gray-200 mt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-5 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                    </div>
                  )}
                  
                </div>
              
            </div>
          </div>
          <div className="pt-10">
            {allContacts.length > 0 && (
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClear={() => setSearchTerm("")}
              contactCount={filteredContacts.length}
            />
          )}
          </div>
          
        </div>

        

        {loading ? <Loading/>: allContacts.length === 0 && <EmptyState onAddContact={addNewContact} />}

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
                  showNotification={showNotification}
                  fetchContacts={fetchContacts}
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
            showNotification={showNotification}
          />
        )}
        <p className="text-white font-serif mt-2 text-lg text-end">
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