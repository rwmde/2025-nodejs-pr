import swaggerAutogen from "swagger-autogen";
import j2s from "joi-to-swagger";
import { studentSchema, updateStudentSchema } from "../middleware/validation";

const { swagger: studentSwagger } = j2s(studentSchema);
const { swagger: updateStudentSwagger } = j2s(updateStudentSchema);

const doc = {
    info: {
        title: "Student Management API",
        description: "API for managing students and authentication",
        version: "1.0.0",
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ["http"],
    securityDefinitions: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
        },
    },
    components: {
        schemas: {
            Student: studentSwagger,
            UpdateStudent: updateStudentSwagger,
        },
    },
};

const outputFile = "./src/config/swagger_output.json";
const endpointsFiles = ["./src/server.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
