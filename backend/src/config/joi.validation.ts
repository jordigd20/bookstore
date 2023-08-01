import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(3000),
  DB_PASSWORD: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
