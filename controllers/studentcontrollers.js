import Student from "../models/student.js";

export function getStudents 
(req,res){
    Student.find().then(
     (studentList)=>{(
         res.json({
             list:studentList
         })
     )}
    )
 }
 export function createStudent (req, res)  {
    const newStudent = new Student(req.body);
    newStudent.save().then(() => {
            res.json({
                message: "Student Created."
            });
        })
        .catch((err) => { 
            res.json({
                message: "Error creating student",
                error: err.message 
            });
        });
}
export function deleteStudent (req, res)  {
    Student.deleteOne({name:req.body.name}).then(() => {
        res.json({
            message: "Student deleted."
        });
    })
}