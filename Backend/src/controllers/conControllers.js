
import { ContactModel } from "../models/contactModel.js";
import multer, { diskStorage } from "multer";
import path from "path";
import fs from "fs";

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
    
    const if_phone = await ContactModel.findOne({phone, user_id})
    
    if(!if_phone){
      const contact = await ContactModel.create({ user_id, name, email, phone, });
      res.status(201).json({contact, created:true});
    }
    else{
      res.status(201).json({message: "Phone number already exists", created:false})
    }
     
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}


export async function specificContact(req, res) {
  try {
    const contact = await ContactModel.findOne({
      _id: req.params.id,
      user_id: req.user.user.id,
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

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (email !== undefined) updateFields.email = email;
  if (phone !== undefined) updateFields.phone = phone;

  try {
    const user_id = req.user.user.id;
    const contactId = req.params.id;

    if (phone !== undefined) {
      const if_phone = await ContactModel.findOne({
        phone,
        user_id,
        _id: { $ne: contactId }, 
      });

      if (if_phone) {
        return res.status(200).json({ message: "Phone number already exists for this user" , created:false});
      }
    }

    const contact = await ContactModel.findOneAndUpdate(
      { _id: contactId, user_id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({
      message: "Contact updated successfully",
      contact,
      created: true,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Phone number already exists for this user" });
    }
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




const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only image files are allowed"), false);
};

export const upload = multer({ storage, fileFilter });



export const uploadProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user.id;
    let updateData = {};

    
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }
    
    else if (req.body && req.body.profileImage === null) {
      updateData.profileImage = "https://via.placeholder.com/150";
    }

    
    if (req.body && req.body.profileImage === null) {
      const contact = await ContactModel.findOne({ _id: id, user_id });
      if (contact && contact.profileImage && contact.profileImage.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), contact.profileImage);
        fs.unlink(oldPath, (err) => {
          if (err) console.log("Error deleting old image:", err);
        });
      }
    }

    
    const updatedContact = await ContactModel.findOneAndUpdate(
      { _id: id, user_id },
      updateData,
      { new: true }
    );

    if (!updatedContact)
      return res.status(404).json({ message: "Contact not found" });

    const message = req.file
      ? "Profile image updated successfully"
      : req.body.profileImage === null
      ? "Profile image removed successfully"
      : "No image uploaded";

    res.status(200).json({
      message,
      contact: updatedContact,
    });
  } catch (err) {
    res.status(500).json({ message: "Error uploading image", error: err });
  }
};
