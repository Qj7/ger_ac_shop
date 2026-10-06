import type { SystemType } from './constants';

/**
 * Demo catalog. Used by the database seed (`apps/api/src/seed.ts`) and by the static
 * GitHub Pages demo of the website, so both always show the same data.
 */

export const DEMO_BRANDS = [
  'Daikin',
  'Mitsubishi Electric',
  'Mitsubishi Heavy Industries',
  'LG',
  'Panasonic',
  'Samsung',
  'Bosch',
  'Midea',
  'Haier',
  'Toshiba',
  'Fujitsu',
  'Gree',
];

export const DEMO_CATEGORIES = [
  { name: 'Wandgeräte', description: 'Klassische, platzsparende Lösung für Wohnräume und Büros.' },
  { name: 'Deckenkassetten', description: 'Unauffällig in die Decke integriert.' },
  { name: 'Decken-/Unterdeckengeräte', description: 'Leistungsstark für größere Räume.' },
  { name: 'Truhengeräte', description: 'Im unteren Wandbereich installiert, wie ein Heizkörper.' },
  { name: 'Kanalgeräte', description: 'Nahezu unsichtbare Klimatisierung über ein Kanalsystem.' },
  { name: 'Wärmepumpen', description: 'Luft-Wasser-Wärmepumpen für Heizung und Warmwasser.' },
];

export interface DemoProduct {
  title: string;
  brand: string;
  category: string;
  systemType: SystemType;
  coolingKw: number;
  heatingKw: number;
  areaM2: number;
  energyClass: string;
  priceFrom: number;
  image: string;
  description: string;
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    title: 'Daikin Perfera Wandgerät 2,5 kW',
    brand: 'Daikin',
    category: 'Wandgeräte',
    systemType: 'SINGLE',
    coolingKw: 2.5,
    heatingKw: 3.2,
    areaM2: 30,
    energyClass: 'A+++',
    priceFrom: 1290,
    image: '/images/products/wall-unit.svg',
    description:
      'Leises und energieeffizientes Wandgerät für Schlaf- und Wohnzimmer. Mit WLAN-Steuerung, Flash-Streamer-Luftreinigung und 3D-Luftstrom.',
  },
  {
    title: 'Mitsubishi Electric Diamond MSZ-LN 3,5 kW',
    brand: 'Mitsubishi Electric',
    category: 'Wandgeräte',
    systemType: 'SINGLE',
    coolingKw: 3.5,
    heatingKw: 4.0,
    areaM2: 45,
    energyClass: 'A+++',
    priceFrom: 1590,
    image: '/images/products/wall-unit.svg',
    description:
      'Premium-Wandgerät mit Doppel-Flap-Technologie, 3D i-see Sensor und besonders leisem Betrieb ab 19 dB(A).',
  },
  {
    title: 'Panasonic Etherea Multi-Split 2x2,5 kW',
    brand: 'Panasonic',
    category: 'Wandgeräte',
    systemType: 'MULTI',
    coolingKw: 5.2,
    heatingKw: 6.8,
    areaM2: 60,
    energyClass: 'A++',
    priceFrom: 2890,
    image: '/images/products/multi-split.svg',
    description: 'Multi-Split-Set mit zwei Inneneinheiten und einem Außengerät – ideal für zwei Räume.',
  },
  {
    title: 'LG Deckenkassette 4-Wege 5,0 kW',
    brand: 'LG',
    category: 'Deckenkassetten',
    systemType: 'SINGLE',
    coolingKw: 5.0,
    heatingKw: 5.8,
    areaM2: 60,
    energyClass: 'A++',
    priceFrom: 2490,
    image: '/images/products/cassette.svg',
    description: 'Unauffällige 4-Wege-Kassette für Büros, Praxen und Gastronomie mit gleichmäßiger Luftverteilung.',
  },
  {
    title: 'Toshiba Truhengerät 3,5 kW',
    brand: 'Toshiba',
    category: 'Truhengeräte',
    systemType: 'SINGLE',
    coolingKw: 3.5,
    heatingKw: 4.2,
    areaM2: 40,
    energyClass: 'A++',
    priceFrom: 1790,
    image: '/images/products/floor-unit.svg',
    description: 'Flexibles Truhengerät für die Montage im unteren Wandbereich – besonders angenehm im Heizbetrieb.',
  },
  {
    title: 'Fujitsu Kanalgerät Slim 5,2 kW',
    brand: 'Fujitsu',
    category: 'Kanalgeräte',
    systemType: 'SINGLE',
    coolingKw: 5.2,
    heatingKw: 6.0,
    areaM2: 65,
    energyClass: 'A+',
    priceFrom: 2690,
    image: '/images/products/duct.svg',
    description: 'Flaches Kanalgerät für die nahezu unsichtbare Klimatisierung mehrerer Räume über ein Kanalsystem.',
  },
  {
    title: 'Samsung EHS Mono Wärmepumpe 8 kW',
    brand: 'Samsung',
    category: 'Wärmepumpen',
    systemType: 'MONOBLOCK',
    coolingKw: 7.5,
    heatingKw: 8.0,
    areaM2: 140,
    energyClass: 'A+++',
    priceFrom: 7990,
    image: '/images/products/heat-pump.svg',
    description: 'Monoblock-Luft-Wasser-Wärmepumpe für Einfamilienhäuser – Heizung und Warmwasser aus einer Einheit.',
  },
  {
    title: 'Daikin Altherma 3 Split Wärmepumpe 6 kW',
    brand: 'Daikin',
    category: 'Wärmepumpen',
    systemType: 'SPLIT',
    coolingKw: 6.0,
    heatingKw: 6.0,
    areaM2: 110,
    energyClass: 'A+++',
    priceFrom: 8990,
    image: '/images/products/heat-pump.svg',
    description: 'Split-Wärmepumpe mit Außen- und Inneneinheit, Vorlauftemperaturen bis 65 °C, ideal für Sanierungen.',
  },
];

export function demoProductSpecs(p: DemoProduct) {
  return [
    { label: 'Kühlleistung', value: `${p.coolingKw.toString().replace('.', ',')} kW` },
    { label: 'Heizleistung', value: `${p.heatingKw.toString().replace('.', ',')} kW` },
    { label: 'Empfohlene Raumgröße', value: `bis ${p.areaM2} m²` },
    { label: 'Energieeffizienz', value: p.energyClass },
    { label: 'Kältemittel', value: 'R32' },
  ];
}
