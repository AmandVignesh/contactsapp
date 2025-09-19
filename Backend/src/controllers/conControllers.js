
import { ContactModel } from "../models/contactModel.js";

export async function getContacts(req, res) {
  try {
    const contacts = await ContactModel.find({ user_id: req.user.user.id });
    
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}


export async function createContact(req, res) {
  const { name, email, phone } = req.body;
  
  try {
    const {id} = req.user.user
    
    const user_id = req.user.user.id;
    
    const contact = await ContactModel.create({ user_id, name, email, phone, });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}


export async function specificContact(req, res) {
  try {
    const contact = await ContactModel.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}


export async function updateContact(req, res) {
  const { name, phone, email } = req.body;
  try {
      const contact = await ContactModel.findOneAndUpdate(
      { _id: req.params.id, 
        user_id: req.user.user.id },
      { name, email, phone },
      { new: true }
    );
    

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact updated successfully", contact });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}


export async function deleteContact(req, res) {
  try {
    const contact = await ContactModel.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.user.id,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}
