import express from "express";
import Student from "../models/student.js";

import { getStudents,createStudent,deleteStudent } from "../controllers/studentcontrollers.js";
//create studentRoutes
const studentRoutes= express.Router();

studentRoutes.get("/",getStudents)

studentRoutes.post("/", createStudent)

studentRoutes.delete("/",deleteStudent)

export default studentRoutes;