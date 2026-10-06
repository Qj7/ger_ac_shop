import { CircleCheckBig } from 'lucide-react';

export function ThankYou({ children }: { children?: React.ReactNode }) {
  return (
    <div className="animate-fade-in py-6 text-center">
      <CircleCheckBig className="mx-auto size-16 text-green-500" />
      <h3 className="mt-5 text-2xl font-bold text-ink">Vielen Dank!</h3>
      <p className="mx-auto mt-3 max-w-sm text-slate-600">
        Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.
      </p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
