import {Router} from "express"
import { registerUser,loginUser } from "../controllers/userController.js"

const route = Router();

route.post("/register", registerUser)
route.post("/login", loginUser)

export default route