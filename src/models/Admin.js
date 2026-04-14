import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["superAdmin", "admin"], default: "admin" },
}, {
  timestamps: true,
  collection: "admin"
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema, "admin");