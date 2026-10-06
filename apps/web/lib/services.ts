import { AirVent, Flame, Wrench, type LucideIcon } from 'lucide-react';

export interface ServiceSummary {
  href: string;
  title: string;
  subtitle: string;
  text: string;
  icon: LucideIcon;
}

export const services: ServiceSummary[] = [
  {
    href: '/leistungen/klimaanlagen',
    title: 'Klimaanlagen',
    subtitle: 'Moderne Klimatechnik für Zuhause & Gewerbe',
    text: 'Beratung, Planung, Verkauf und fachgerechte Montage von Single-Split- und Multi-Split-Systemen.',
    icon: AirVent,
  },
  {
    href: '/leistungen/waermepumpen',
    title: 'Wärmepumpen',
    subtitle: 'Effizient heizen mit moderner Technik',
    text: 'Luft-Wasser-Wärmepumpen für Ein- und Mehrfamilienhäuser – Monoblock oder Split.',
    icon: Flame,
  },
  {
    href: '/leistungen/service-wartung',
    title: 'Service & Wartung',
    subtitle: 'Damit Ihre Anlage zuverlässig funktioniert',
    text: 'Wartung, Reinigung, Fehlerdiagnose und Reparatur von Klimaanlagen und Wärmepumpen.',
    icon: Wrench,
  },
];
