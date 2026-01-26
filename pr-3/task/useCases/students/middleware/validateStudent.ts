import joi from 'joi';

export const validate = (
  schema: joi.Schema,
  source: 'body' | 'params' | 'query' = 'body'
) => {
  return (req: any, res: any, next: any) => {
    const data =
      source === 'body'
        ? req.body
        : source === 'params'
        ? req.params
        : req.query;
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: messages });
    }

    if (source === 'body') {
      req.body = value;
    } else if (source === 'params') {
      req.params = value;
    } else {
      req.query = value;
    }

    next();
  };
};
