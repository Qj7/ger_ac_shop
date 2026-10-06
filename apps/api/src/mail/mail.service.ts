import { Injectable, Logger } from '@nestjs/common';
import { formatQuizAnswers, LEAD_TYPE_LABELS, SALUTATION_LABELS, type LeadType, type QuizAnswers } from '@ic/shared';
import nodemailer, { type Transporter } from 'nodemailer';
import { config } from '../config';

export interface LeadMailData {
  id: string;
  type: LeadType;
  salutation?: string | null;
  company?: string | null;
  name?: string | null;
  email: string;
  phone?: string | null;
  zip?: string | null;
  message?: string | null;
  answers: QuizAnswers;
  productTitle?: string | null;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null = config.smtp.host
    ? nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
      })
    : null;

  async sendLeadNotification(lead: LeadMailData): Promise<void> {
    const rows: [string, string][] = [
      ['Art', LEAD_TYPE_LABELS[lead.type]],
      ['Anrede', lead.salutation ? (SALUTATION_LABELS as Record<string, string>)[lead.salutation] ?? lead.salutation : ''],
      ['Firma', lead.company ?? ''],
      ['Name', lead.name ?? ''],
      ['E-Mail', lead.email],
      ['Telefon', lead.phone ?? ''],
      ['PLZ / Ort', lead.zip ?? ''],
      ['Produkt', lead.productTitle ?? ''],
      ...formatQuizAnswers(lead.answers).map((a): [string, string] => [a.question, a.answer]),
      ['Nachricht', lead.message ?? ''],
    ].filter(([, v]) => v) as [string, string][];

    const subject = `Neue Anfrage (${LEAD_TYPE_LABELS[lead.type]}) – ${lead.name || lead.email}`;
    const link = `${config.publicSiteUrl}/admin/leads/${lead.id}`;
    const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nIm Admin öffnen: ${link}`;
    const html = `
      <h2 style="font-family:Arial,sans-serif">${escapeHtml(subject)}</h2>
      <table style="font-family:Arial,sans-serif;border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top"><b>${escapeHtml(k)}</b></td><td style="padding:4px 0">${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`,
          )
          .join('')}
      </table>
      <p style="font-family:Arial,sans-serif"><a href="${link}">Anfrage im Admin öffnen</a></p>`;

    if (!this.transporter || !config.smtp.to) {
      this.logger.log(`[mail disabled] ${subject}\n${text}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: config.smtp.from,
        to: config.smtp.to,
        replyTo: lead.email,
        subject,
        text,
        html,
      });
    } catch (err) {
      this.logger.error(`Failed to send lead notification for ${lead.id}`, err as Error);
    }
  }
}
