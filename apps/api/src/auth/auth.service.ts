import { Injectable, Logger, OnApplicationBootstrap, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { config } from '../config';
import { PrismaService } from '../prisma/prisma.service';
import type { AdminJwtPayload } from './admin.guard';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.prisma.adminUser.count();
    if (count > 0) return;

    if (!config.adminEmail || !config.adminPassword) {
      this.logger.warn('No admin user exists. Set ADMIN_EMAIL and ADMIN_PASSWORD to create one on start.');
      return;
    }

    await this.prisma.adminUser.create({
      data: {
        email: config.adminEmail.toLowerCase(),
        passwordHash: await argon2.hash(config.adminPassword),
        name: 'Administrator',
      },
    });
    this.logger.log(`Created initial admin user ${config.adminEmail}`);
  }

  async login(email: string, password: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
    const valid = admin ? await argon2.verify(admin.passwordHash, password) : false;
    if (!admin || !valid) throw new UnauthorizedException('E-Mail oder Passwort ist falsch');

    const payload: AdminJwtPayload = { sub: admin.id, email: admin.email };
    return { token: await this.jwt.signAsync(payload), admin: { id: admin.id, email: admin.email, name: admin.name } };
  }

  async me(id: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id },
      select: { id: true, email: true, name: true },
    });
    if (!admin) throw new UnauthorizedException();
    return admin;
  }
}
