import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { leadCreateSchema, type LeadCreateInput } from '@ic/shared';
import { ZodPipe } from '../common/zod.pipe';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  create(@Body(new ZodPipe(leadCreateSchema)) body: LeadCreateInput) {
    return this.leads.create(body);
  }
}
