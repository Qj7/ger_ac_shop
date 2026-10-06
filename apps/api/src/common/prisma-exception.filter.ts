import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    switch (exception.code) {
      case 'P2002':
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'Ein Eintrag mit diesem Wert (z. B. Slug) existiert bereits.',
        });
      case 'P2003':
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'Der Eintrag wird noch verwendet (z. B. von Produkten) und kann nicht gelöscht werden.',
        });
      case 'P2025':
        return res.status(HttpStatus.NOT_FOUND).json({ statusCode: HttpStatus.NOT_FOUND, message: 'Nicht gefunden' });
      default:
        console.error(exception);
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Interner Fehler' });
    }
  }
}
