import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const studentSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    age: Joi.number().integer().min(0).max(120).required(),
    group: Joi.number().integer().required(),
});

export const updateStudentSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    age: Joi.number().integer().min(0).max(120),
    group: Joi.number().integer(),
}).min(1);

export const validateStudent = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { error } = studentSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export const validateUpdateStudent = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { error } = updateStudentSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
