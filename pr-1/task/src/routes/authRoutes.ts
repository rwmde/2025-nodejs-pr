import { Router } from "express";
import { register, login } from "../controllers/AuthController";

const router = Router();

// #swagger.tags = ['Auth']
// #swagger.summary = 'Register a new user'
router.post("/register", register);

// #swagger.tags = ['Auth']
// #swagger.summary = 'Login and get JWT token'
router.post("/login", login);

export default router;
