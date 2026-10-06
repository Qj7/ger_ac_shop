import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { site } from '@/lib/site';

export function ContactAside() {
  const rows = [
    { icon: Phone, label: 'Telefon', value: site.phone, href: site.phoneHref },
    { icon: Mail, label: 'E-Mail', value: site.email, href: `mailto:${site.email}` },
    { icon: Clock, label: 'Erreichbarkeit', value: site.hours },
    {
      icon: MapPin,
      label: 'Adresse',
      value: `${site.address.company}, ${site.address.street}, ${site.address.city}`,
    },
  ];
  return (
    <aside className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-900 p-8 text-white">
      <h2 className="text-xl font-bold">So erreichen Sie uns</h2>
      <ul className="mt-6 space-y-5">
        {rows.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Icon className="size-5 text-sky-accent" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-widest text-brand-200">{label}</span>
              {href ? (
                <a href={href} className="font-semibold hover:underline">
                  {value}
                </a>
              ) : (
                <span className="font-semibold">{value}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
