import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import sharp from 'sharp';
import { AdminGuard } from '../auth/admin.guard';
import { config } from '../config';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 8 * 1024 * 1024;

@UseGuards(AdminGuard)
@Controller('admin/uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_BYTES },
      fileFilter: (_req, file, cb) =>
        ALLOWED.includes(file.mimetype)
          ? cb(null, true)
          : cb(new BadRequestException('Nur JPG, PNG, WEBP oder AVIF erlaubt'), false),
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Keine Datei hochgeladen');

    const name = `${randomUUID()}.webp`;
    try {
      await sharp(file.buffer)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(join(config.uploadDir, name));
    } catch {
      throw new BadRequestException('Bild konnte nicht verarbeitet werden');
    }

    return { url: `/api/uploads/${name}` };
  }
}
