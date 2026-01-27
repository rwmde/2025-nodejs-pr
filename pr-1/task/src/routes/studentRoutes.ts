import express from "express";
import { StudentController } from "../controllers/studentController";
import {
    validateStudent,
    validateUpdateStudent,
} from "../middleware/validation";

const router = express.Router();
const studentController = new StudentController();

// #swagger.tags = ['Students']
// #swagger.summary = 'Get average age of students'
router.get("/average-age", studentController.getAverageAge);

// #swagger.tags = ['Students']
// #swagger.summary = 'Get students by group'
router.get("/group/:group", studentController.getStudentsByGroup);

// #swagger.tags = ['Students']
// #swagger.summary = 'Get all students'
router.get("/", studentController.getAllStudents);

// #swagger.tags = ['Students']
// #swagger.summary = 'Get student by ID'
router.get("/:id", studentController.getStudentById);

// #swagger.tags = ['Students']
// #swagger.summary = 'Create a new student'
/* #swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
            schema: { $ref: "#/components/schemas/Student" }
        }
    }
} */
router.post("/", validateStudent, studentController.createStudent);

// #swagger.tags = ['Students']
// #swagger.summary = 'Update a student'
/* #swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
            schema: { $ref: "#/components/schemas/UpdateStudent" }
        }
    }
} */
router.put("/:id", validateUpdateStudent, studentController.updateStudent);

// #swagger.tags = ['Students']
// #swagger.summary = 'Replace all students'
/* #swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
            schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Student" }
            }
        }
    }
} */
router.put("/", studentController.replaceAllStudents);

// #swagger.tags = ['Students']
// #swagger.summary = 'Delete a student'
router.delete("/:id", studentController.deleteStudent);

export default router;
