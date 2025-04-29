import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add your name"],
    },
    email: {
        type: String,
        required: [true, "Please add your email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add your password"],
    },
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
});

// Prevent model overwrite in dev
export default mongoose.models.User || mongoose.model("User", UserSchema);
