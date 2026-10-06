import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AUTH_COOKIE } from '../config';

export interface AdminJwtPayload {
  sub: string;
  email: string;
}

export type AdminRequest = Request & { admin: AdminJwtPayload };

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AdminRequest>();
    const token: string | undefined = req.cookies?.[AUTH_COOKIE];
    if (!token) throw new UnauthorizedException();

    try {
      req.admin = await this.jwt.verifyAsync<AdminJwtPayload>(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
