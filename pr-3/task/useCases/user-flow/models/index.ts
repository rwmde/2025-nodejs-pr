import joi from 'joi';

export const UserRegistrationSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  name: joi.string().required(),
  surname: joi.string().required(),
});

export const LoginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});
