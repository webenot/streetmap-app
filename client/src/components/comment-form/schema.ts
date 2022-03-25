import Joi from 'joi';

export const messageSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .trim()
    .required(),

  message: Joi.string()
    .min(1)
    .max(500)
    .trim()
    .required(),
});