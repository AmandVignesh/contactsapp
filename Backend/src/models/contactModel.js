import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
    {
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref: "User"
        },
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        phone:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const ContactModel = mongoose.model("Contact", ContactSchema)