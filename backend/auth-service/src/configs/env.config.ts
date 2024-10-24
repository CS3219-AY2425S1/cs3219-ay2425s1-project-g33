import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

export const config = {
  userService: {
    port: parseInt(getEnvVar('USER_SERVICE_PORT')),
    host: getEnvVar('USER_SERVICE_HOST'),
    transport: Transport[getEnvVar('USER_SERVICE_TRANSPORT')] || Transport.TCP,
  },
  authService: {
    port: parseInt(getEnvVar('AUTH_SERVICE_PORT')),
    host: getEnvVar('AUTH_SERVICE_HOST'),
    transport: Transport[getEnvVar('AUTH_SERVICE_TRANSPORT')] || Transport.TCP,
  },
  strategies: {
    accessTokenStrategy: getEnvVar('ACCESS_TOKEN_STRATEGY'),
    refreshTokenStrategy: getEnvVar('REFRESH_TOKEN_STRATEGY'),
    googleStrategy: getEnvVar('GOOGLE_STRATEGY'),
    githubStrategy: getEnvVar('GITHUB_STRATEGY'),
  },
  auth: {
    local: {
      jwtSecret: getEnvVar('JWT_SECRET'),
      jwtTokenExpiration: getEnvVar('JWT_TOKEN_EXPIRATION'),
      jwtRefreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
      jwtRefreshTokenExpiration: getEnvVar('JWT_REFRESH_TOKEN_EXPIRATION'),
    },
    google: {
      clientId: getEnvVar('GOOGLE_CLIENT_ID'),
      clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
      callbackUrl: getEnvVar('GOOGLE_CALLBACK_URL'),
    },
    github: {
      clientId: getEnvVar('GITHUB_CLIENT_ID'),
      clientSecret: getEnvVar('GITHUB_CLIENT_SECRET'),
      callbackUrl: getEnvVar('GITHUB_CALLBACK_URL'),
    },
  },
  mailer: {
    user: getEnvVar('NODEMAILER_GMAIL_USER'),
    password: getEnvVar('NODEMAILER_GMAIL_PASSWORD'),
  },
  frontendUrl: getEnvVar('FRONTEND_URL'),
};
