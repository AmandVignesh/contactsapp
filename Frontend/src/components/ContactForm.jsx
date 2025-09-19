import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const ContactForm = ({ contact, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = Cookies.get("jwt_token");

      let response;
      if (contact) {
        
        response = await axios.put(
          `https://contactapp-6siq.onrender.com/api/contacts/${contact._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          "https://contactapp-6siq.onrender.com/api/contacts",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      onSave(response.data.contact || response.data);

      onClose();
    } catch (error) {
      console.error("Error saving contact", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#00000080] bg-opacity-40">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {contact ? "Edit Contact" : "Add Contact"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-gray-800">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mt-2"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="text-gray-800">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mt-2"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-gray-800">Phone:</label>
            <input
              id="phone"
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mt-2"
              required
            />
          </div>
          

          <button
            type="submit"
            className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Save className="w-4 h-4 mr-2" />
            {contact ? "Update Contact" : "Save Contact"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
