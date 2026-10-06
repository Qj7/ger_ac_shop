import { resolve } from 'node:path';

const env = process.env;
const isProduction = env.NODE_ENV === 'production';

if (isProduction && (!env.JWT_SECRET || env.JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET must be set to a random string of at least 32 characters in production');
}

export const config = {
  isProduction,
  port: Number(env.API_PORT ?? 4000),
  jwtSecret: env.JWT_SECRET ?? 'dev-secret-change-me-dev-secret-change-me',
  cookieSecure: env.COOKIE_SECURE === 'true',
  uploadDir: resolve(env.UPLOAD_DIR ?? './uploads'),
  adminEmail: env.ADMIN_EMAIL,
  adminPassword: env.ADMIN_PASSWORD,
  publicSiteUrl: (env.PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  smtp: {
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT ?? 587),
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.MAIL_FROM ?? 'IC Klima Service <no-reply@localhost>',
    to: env.MAIL_TO,
  },
};

export const AUTH_COOKIE = 'ic_admin';
