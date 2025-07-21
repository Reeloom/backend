import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

// Carregar variáveis de ambiente
const envPath =
  process.env.NODE_ENV === 'production' ? '../../.env' : '../../.env.local';
dotenv.config({ path: path.join(__dirname, envPath) });

// Schema de validação das variáveis de ambiente
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(10080),
    REDIS_URL: Joi.string().optional(),
    LOG_LEVEL: Joi.string().default('info'),
    LOG_FORMAT: Joi.string().default('json'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Configuração centralizada
export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },
  redis: {
    url: envVars.REDIS_URL,
  },
  logs: {
    level: envVars.LOG_LEVEL,
    format: envVars.LOG_FORMAT,
  },
} as const;

export default config;
