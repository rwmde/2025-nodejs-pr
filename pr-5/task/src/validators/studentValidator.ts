import Joi from 'joi';

// Joi schema for student validation
export const studentSchema = Joi.object({
  name: Joi.string().min(1).required(),
  age: Joi.number().integer().min(0).required(),
  group: Joi.string().min(1).required()
});
