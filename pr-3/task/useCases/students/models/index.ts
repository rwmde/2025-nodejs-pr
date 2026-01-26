import joi from 'joi';

export const StudentSchema = joi.object({
  studentId: joi.string().optional(),
  studentName: joi.string().required(),
  age: joi.number().required(),
  groupNumber: joi.number().required(),
});

export const CreateStudentSchema = joi.object({
  studentName: joi.string().required(),
  age: joi.number().required(),
  groupNumber: joi.number().required(),
});

export const UpdateStudentSchema = joi.object({
  studentName: joi.string().required(),
  age: joi.number().required(),
  groupNumber: joi.number().required(),
});

export const ReplaceStudentsSchema = joi.array().items(
  joi.object({
    studentId: joi.string().optional(),
    studentName: joi.string().required(),
    age: joi.number().required(),
    groupNumber: joi.number().required(),
  })
);

export const GroupIdParamSchema = joi.object({
  id: joi.number().required(),
});

export const StudentIdParamSchema = joi.object({
  id: joi.string().required(),
});
