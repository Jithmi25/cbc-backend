import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    name: String,
    age: Number,
    gender: String
});
const Student = mongoose.model("Student", studentSchema);

export default Student