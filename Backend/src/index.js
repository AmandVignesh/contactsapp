import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"

import route from "./routes/userRouter.js"
import contact from "./newroute.js"
dotenv.config()
const app = express();

app.use(cors())
app.use(express.json())


const PORT =  process.env.PORT

const url = process.env.MONGO_URL

app.use("/api/users", route)
app.use("/api/contacts",contact)

if(!url){
    console.error("MongoDb URL is not defined in .env file");
    process.exit(1);
}


async function main(){
    try {
        await connectDB(url)
        app.listen(PORT,()=>{
            console.log(`Server is running on http://localhost:${PORT}`)
        });
    } catch (error) {
        console.error("MongoDb URL is not defined in .env file",error);
        process.exit(1);
    }
}

main()
