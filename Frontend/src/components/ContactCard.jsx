import React, { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, Upload, X } from "lucide-react";
import Cookies from "js-cookie"
// 👇 change this to your backend deployed URL
const backendBaseUrl = "https://contactapp-6siq.onrender.com"; 

const ContactCard = ({
  contact = { _id: null, name: "", email: "", phone: "", profileImage: "" },
  onEdit,
  onDelete,
  isDeleting = false,
  showNotification,
  fetchContacts
}) => {
  const [justAdded, setJustAdded] = useState(contact.isNew);
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (contact.isNew) {
      const timer = setTimeout(() => setJustAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [contact.isNew]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Upload Image function
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await fetch(
        `${backendBaseUrl}/api/contacts/${contact._id}/profile-image`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt_token")}`, 
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        showNotification("Profile image updated successfully", "success");
      } else {
        showNotification(data.message || "Failed to upload image", "failure");
      }
      fetchContacts()
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setShowPopup(false);
    }
  };

  // ✅ Remove Image function
  const handleRemoveImage = async () => {
    try {
      const response = await fetch(
        `${backendBaseUrl}/api/contacts/${contact._id}/profile-image`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
          body: JSON.stringify({ profileImage: null }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        showNotification("Profile image removed successfully", "success")
      } else {
        showNotification(data.message || "Failed to remove image", "failure");
      }
      fetchContacts()
    } catch (error) {
      console.error("Error removing image:", error);
    } finally {
      setShowPopup(false);
    }
  };

  const profileImageSrc =
    contact.profileImage && contact.profileImage !== "https://via.placeholder.com/150"
      ? `${backendBaseUrl}${contact.profileImage}`
      : "https://res.cloudinary.com/dnx2ozxvd/image/upload/v1760503069/LogoMakr-8tj07g_tljbtv.png";

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg p-5 border transition-all duration-300 transform hover:shadow-xl ${
        justAdded ? "border-green-400 ring-2 ring-green-300" : "border-gray-200"
      } ${isDeleting ? "opacity-50" : ""}`}
    >
      {/* Profile Image */}
      <div className="flex items-center space-x-4 mb-3">
        <div className="relative">

          { contact.profileImage==="https://via.placeholder.com/150" ? 
          <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center flex-shrink-0 relative" onClick={() => setShowPopup((prev) => !prev)}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          :
          <img
            src={profileImageSrc}
            alt="Profile"
            className="w-16 h-16 rounded-full border cursor-pointer object-cover"
            onClick={() => setShowPopup((prev) => !prev)}
          />}

          {/* Popup menu */}
          {showPopup && (
            <div
              ref={popupRef}
              className="absolute z-[9999] top-20 mt-2 w-40 bg-white border rounded-lg shadow-lg right-0 left-20"
            >
              { contact.profileImage=== "https://via.placeholder.com/150"? <button
                onClick={() => fileInputRef.current.click()}
                className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
              >
                <Upload size={16} /> Upload Image
              </button>
            :
              <button
                onClick={handleRemoveImage}
                className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={16} /> Remove Image
              </button>}

              <button
                onClick={() => setShowPopup(false)}
                className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800">{contact.name}</h3>
          <p className="text-gray-600">{contact.email}</p>
          <p className="text-gray-600">{contact.phone}</p>
        </div>
      </div>

      {/* Hidden file input for upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleUploadImage}
        style={{ display: "none" }}
      />

      {/* Edit/Delete Buttons */}
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
