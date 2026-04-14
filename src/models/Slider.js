import mongoose from "mongoose";

const SliderSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
}, {
    timestamps: true,
    collection: "sliderimages"
});

export default mongoose.models.Slider || mongoose.model("Slider", SliderSchema, "sliderimages");
