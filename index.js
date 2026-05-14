const express = require("express");
const cors = require("cors");
const app = express();

const { initializeDatabase } = require("./db/db.connect");
const { Student } = require("./models/students.model");

app.use(express.json());
app.use(cors());

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

app.post("/students", async (req, res) => {
  const { name, age, gender, grade, attendance, marks } = req.body;

  try {
    const student = new Student({
      name,
      age,
      gender,
      grade,
      attendance,
      marks,
    });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

app.post("/students/:id", async (req, res) => {
  const studentId = req.params.id;
  const updatedStudentData = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updatedStudentData,
      { new: true },
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", meesage: error.message });
  }
});

app.delete("/students/delete/:id", async (req, res) => {
  try {
    const { studentId } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (deletedStudent) {
      res.status(200).json({ message: "Student deleted successfully." });
    } else {
      res
        .status(404)
        .json({ error: `Student with ID ${studentId} not found.` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete the student.", message: error.message });
  }
});
module.exports = app;
