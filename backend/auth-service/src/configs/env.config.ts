import { Transport } from '@nestjs/microservices';

export const config = {
  authService: {
    port: parseInt(process.env.AUTH_SERVICE_PORT) || 3003,
    host: process.env.AUTH_SERVICE_HOST || '0.0.0.0',
    transport: Transport[process.env.AUTH_SERVICE_TRANSPORT] || Transport.TCP,
  },
  userService: {
    port: parseInt(process.env.USER_SERVICE_PORT) || 3001,
    host: process.env.USER_SERVICE_HOST || 'user-service',
    transport: Transport[process.env.USER_SERVICE_TRANSPORT] || Transport.TCP,
  },
  strategies: {
    accessTokenStrategy: process.env.ACCESS_TOKEN_STRATEGY || 'jwt',
    refreshTokenStrategy: process.env.REFRESH_TOKEN_STRATEGY || 'jwt-refresh',
    googleStrategy: process.env.GOOGLE_STRATEGY || 'google',
    githubStrategy: process.env.GITHUB_STRATEGY || 'github',
  },
  auth: {
    local: {
      jwtSecret: process.env.JWT_SECRET,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackUrl: process.env.GITHUB_CALLBACK_URL,
    },
  },
  mailer: {
    user: process.env.NODEMAILER_GMAIL_USER,
    password: process.env.NODEMAILER_GMAIL_PASSWORD,
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
