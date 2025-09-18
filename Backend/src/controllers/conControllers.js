
import { ContactModel } from "../models/contactModel.js";
// ✅ Get all contacts for logged-in user
export async function getContacts(req, res) {
    console.log("get ",req.user)
  try {
    const contacts = await ContactModel.find({ user_id: req.user.user.id });
    // console.log("get contacts",contacts)
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}

// ✅ Create new contact for logged-in user
export async function createContact(req, res) {
  const { name, email, phone } = req.body;
  console.log("body",req.user)

  try {
    console.log("body inside try",req.user)
    const {id} = req.user.user
    // console.log(id)
    const user_id = req.user.user.id;
    // console.log("Backend -id ",user_id)
    const contact = await ContactModel.create({ user_id, name, email, phone, });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}

// ✅ Get single contact (only if it belongs to user)
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
  console.log("get form updated",req.user.user)
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
