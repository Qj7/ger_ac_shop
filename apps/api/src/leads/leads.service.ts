import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  formatQuizAnswers,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_TYPES,
  LEAD_TYPE_LABELS,
  SALUTATION_LABELS,
  type LeadCreateInput,
  type LeadStatus,
  type LeadType,
  type LeadUpdateInput,
  type QuizAnswers,
} from '@ic/shared';
import { Prisma } from '@prisma/client';
import { parsePagination } from '../common/pagination';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';

export interface LeadListQuery {
  status?: string;
  type?: string;
  q?: string;
  from?: string;
  to?: string;
  page?: string;
  limit?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async create(input: LeadCreateInput) {
    // Honeypot filled in: pretend success, store nothing.
    if (input.website) return { ok: true };

    let productTitle: string | null = null;
    if (input.productId) {
      const product = await this.prisma.product.findUnique({ where: { id: input.productId }, select: { title: true } });
      if (!product) throw new BadRequestException('Produkt nicht gefunden');
      productTitle = product.title;
    }

    const lead = await this.prisma.lead.create({
      data: {
        type: input.type,
        salutation: input.salutation ?? null,
        company: input.company || null,
        name: input.name || null,
        email: input.email,
        phone: input.phone || null,
        zip: input.zip || null,
        message: input.message || null,
        answers: input.answers as Prisma.InputJsonValue,
        source: (input.source ?? {}) as Prisma.InputJsonValue,
        productId: input.productId ?? null,
      },
    });

    void this.mail.sendLeadNotification({ ...lead, answers: input.answers as QuizAnswers, productTitle });
    return { ok: true };
  }

  private buildWhere(query: LeadListQuery): Prisma.LeadWhereInput {
    const where: Prisma.LeadWhereInput = {};
    if (query.status && (LEAD_STATUSES as readonly string[]).includes(query.status)) {
      where.status = query.status as LeadStatus;
    }
    if (query.type && (LEAD_TYPES as readonly string[]).includes(query.type)) {
      where.type = query.type as LeadType;
    }
    if (query.q?.trim()) {
      const q = query.q.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q } },
        { company: { contains: q, mode: 'insensitive' } },
        { zip: { contains: q, mode: 'insensitive' } },
      ];
    }
    const createdAt: Prisma.DateTimeFilter = {};
    if (query.from && !Number.isNaN(Date.parse(query.from))) createdAt.gte = new Date(query.from);
    if (query.to && !Number.isNaN(Date.parse(query.to))) createdAt.lt = new Date(Date.parse(query.to) + DAY_MS);
    if (createdAt.gte || createdAt.lt) where.createdAt = createdAt;
    return where;
  }

  async list(query: LeadListQuery) {
    const { page, pageSize, skip, take } = parsePagination(query.page, query.limit);
    const where = this.buildWhere(query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { product: { select: { id: true, title: true, slug: true } } },
      }),
      this.prisma.lead.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  async get(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { product: { select: { id: true, title: true, slug: true } } },
    });
    if (!lead) throw new NotFoundException('Anfrage nicht gefunden');
    return { ...lead, formattedAnswers: formatQuizAnswers(lead.answers as QuizAnswers) };
  }

  update(id: string, input: LeadUpdateInput) {
    return this.prisma.lead.update({ where: { id }, data: input });
  }

  async remove(id: string) {
    await this.prisma.lead.delete({ where: { id } });
    return { ok: true };
  }

  async exportCsv(query: LeadListQuery): Promise<string> {
    const leads = await this.prisma.lead.findMany({
      where: this.buildWhere(query),
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { title: true } } },
      take: 10_000,
    });

    const esc = (v: unknown) => {
      const s = v == null ? '' : String(v);
      return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = [
      'Datum',
      'Art',
      'Status',
      'Anrede',
      'Firma',
      'Name',
      'E-Mail',
      'Telefon',
      'PLZ/Ort',
      'Produkt',
      'Angaben',
      'Nachricht',
      'Notizen',
    ];
    const lines = leads.map((l) =>
      [
        l.createdAt.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }),
        LEAD_TYPE_LABELS[l.type],
        LEAD_STATUS_LABELS[l.status],
        l.salutation ? (SALUTATION_LABELS as Record<string, string>)[l.salutation] ?? l.salutation : '',
        l.company,
        l.name,
        l.email,
        l.phone,
        l.zip,
        l.product?.title,
        formatQuizAnswers(l.answers as QuizAnswers)
          .map((a) => `${a.question}: ${a.answer}`)
          .join(' | '),
        l.message,
        l.notes,
      ]
        .map(esc)
        .join(';'),
    );
    // BOM so that Excel opens the UTF-8 file with correct umlauts.
    return '\uFEFF' + [header.join(';'), ...lines].join('\r\n');
  }

  async stats() {
    const now = Date.now();
    const [newLeads, last7, last30, total, activeProducts, latest] = await this.prisma.$transaction([
      this.prisma.lead.count({ where: { status: 'NEW' } }),
      this.prisma.lead.count({ where: { createdAt: { gte: new Date(now - 7 * DAY_MS) } } }),
      this.prisma.lead.count({ where: { createdAt: { gte: new Date(now - 30 * DAY_MS) } } }),
      this.prisma.lead.count(),
      this.prisma.product.count({ where: { active: true } }),
      this.prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);
    return { newLeads, last7, last30, total, activeProducts, latest };
  }
}
