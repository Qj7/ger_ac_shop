import { Body, Controller, Delete, Get, Header, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { leadUpdateSchema, type LeadUpdateInput } from '@ic/shared';
import { AdminGuard } from '../auth/admin.guard';
import { ZodPipe } from '../common/zod.pipe';
import { LeadsService, type LeadListQuery } from './leads.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminLeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Get('stats')
  stats() {
    return this.leads.stats();
  }

  @Get('leads')
  list(@Query() query: LeadListQuery) {
    return this.leads.list(query);
  }

  @Get('leads/export.csv')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="anfragen.csv"')
  export(@Query() query: LeadListQuery) {
    return this.leads.exportCsv(query);
  }

  @Get('leads/:id')
  get(@Param('id') id: string) {
    return this.leads.get(id);
  }

  @Patch('leads/:id')
  update(@Param('id') id: string, @Body(new ZodPipe(leadUpdateSchema)) body: LeadUpdateInput) {
    return this.leads.update(id, body);
  }

  @Delete('leads/:id')
  remove(@Param('id') id: string) {
    return this.leads.remove(id);
  }
}
