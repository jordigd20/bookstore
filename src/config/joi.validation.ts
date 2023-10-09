import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(3000),
  DB_PASSWORD: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_PASSWORD_SECRET: Joi.string().required(),
  STRIPE_API_KEY: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USER: Joi.string().email().required(),
  MAIL_PASSWORD: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
});
