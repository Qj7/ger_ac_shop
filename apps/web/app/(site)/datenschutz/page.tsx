import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/LegalPage';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Datenschutzerklärung', robots: { index: false } };

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        Platzhalter: Bitte lassen Sie die Datenschutzerklärung rechtlich prüfen und ergänzen.
      </p>
      <h2>1. Verantwortlicher</h2>
      <p>
        {site.address.company}, {site.address.street}, {site.address.city}. E-Mail:{' '}
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
      <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
      <p>
        Wenn Sie unseren Klimaplaner oder ein Kontaktformular nutzen, verarbeiten wir die von Ihnen angegebenen Daten
        (z. B. Name, E-Mail-Adresse, Telefonnummer, PLZ/Ort, Angaben zu Ihrem Objekt) ausschließlich zur Bearbeitung
        Ihrer Anfrage und zur Erstellung eines Angebots. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
        (vorvertragliche Maßnahmen) sowie Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
      </p>
      <h2>3. Speicherdauer</h2>
      <p>
        Anfragedaten werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind, spätestens nach
        Ablauf gesetzlicher Aufbewahrungsfristen.
      </p>
      <h2>4. Cookies und lokale Speicherung</h2>
      <p>
        Wir verwenden ausschließlich technisch notwendige Cookies bzw. lokale Speicherung (z. B. Zwischenspeicherung
        Ihrer Planer-Angaben während der Sitzung, Hinweis-Banner). Es findet kein Tracking durch Dritte statt.
        Schriftarten werden lokal von unserem Server ausgeliefert.
      </p>
      <h2>5. Server-Logfiles</h2>
      <p>
        Beim Aufruf der Website werden technisch notwendige Daten (IP-Adresse, Zeitpunkt, aufgerufene Seite) zur
        Gewährleistung der Sicherheit kurzzeitig verarbeitet (Art. 6 Abs. 1 lit. f DSGVO).
      </p>
      <h2>6. Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit
        sowie Widerspruch und Widerruf erteilter Einwilligungen. Zudem können Sie sich bei einer
        Datenschutz-Aufsichtsbehörde beschweren.
      </p>
    </LegalPage>
  );
}
