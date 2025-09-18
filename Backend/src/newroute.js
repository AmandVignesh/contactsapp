import {Router} from "express"

import { getContacts,createContact,specificContact,updateContact,deleteContact } from "./controllers/conControllers.js";
import  protect  from "./middlewares/auth.js";

const contact = Router();

contact.get("/", protect, getContacts);
contact.post("/", protect, createContact);
contact.get("/:id", protect, specificContact);
contact.put("/:id", protect, updateContact);
contact.delete("/:id", protect, deleteContact);

export default contact;
