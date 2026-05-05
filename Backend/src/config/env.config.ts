import dotenv from 'dotenv';
dotenv.config();

export const env = {
  MONGODB_URI: process.env.MONGODB_URI as string,
  REDIS_URL: process.env.REDIS_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
};

const required = ['MONGODB_URI', 'REDIS_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!env[key as keyof typeof env]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}