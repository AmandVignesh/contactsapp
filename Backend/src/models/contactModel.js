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
        },
        profileImage: {
            type: String,
            default: "https://via.placeholder.com/150"
        }
    },
    {
        timestamps: true
    }
)
ContactSchema.index({ user_id: 1, phone: 1 }, { unique: true });
export const ContactModel = mongoose.model("Contact", ContactSchema)