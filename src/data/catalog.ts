import type { Product } from '@/types';

const COUNTRIES = [
  'USA', 'UK', 'CANADA', 'GERMANY', 'FRANCE', 'ITALY', 'SPAIN', 'AUSTRALIA',
  'BELGIUM', 'NETHERLANDS', 'COLOMBIA', 'PERU', 'BAHAMAS', 'MEXICO', 'BRAZIL',
];

const BRANDS = ['VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DISCOVER'];

const LEVELS = [
  'CLASSIC', 'STANDARD', 'GOLD', 'PLATINUM', 'SIGNATURE', 'BUSINESS',
  'PREPAID', 'WORLD ELITE', 'TRADITIONAL', 'REWARDS',
];

const TYPES = [
  'CREDIT', 'DEBIT', 'CREDIT BUSINESS', 'DEBIT CLASSIC', 'CREDIT GOLD',
  'CREDIT PLATINUM', 'DEBIT PREPAID', 'CREDIT SIGNATURE', 'CREDIT WORLD',
];

const ISSUERS: Record<string, string[]> = {
  USA: ['CHASE BANK', 'BANK OF AMERICA', 'WELLS FARGO', 'CITI BANK', 'CAPITAL ONE', 'US BANK', 'AMERICAN EXPRESS', 'DISCOVER BANK'],
  UK: ['BARCLAYS', 'HSBC', 'LLOYDS BANK', 'NATWEST', 'SANTANDER'],
  CANADA: ['RBC', 'TD BANK', 'SCOTIABANK', 'CIBC', 'BMO'],
  GERMANY: ['DEUTSCHE BANK', 'COMMERZBANK'],
  FRANCE: ['BNP PARIBAS', 'SOCIETE GENERALE', 'CREDIT AGRICOLE'],
  ITALY: ['UNICREDIT', 'INTESA SANPAOLO'],
  SPAIN: ['BBVA', 'SANTANDER', 'CAIXABANK'],
  AUSTRALIA: ['ANZ', 'COMMONWEALTH BANK', 'WESTPAC', 'NAB'],
  BELGIUM: ['KBC BANK', 'ING BELGIUM', 'BNP PARIBAS FORTIS'],
  NETHERLANDS: ['ING', 'ABN AMRO', 'RABOBANK'],
  COLOMBIA: ['BANCOLOMBIA', 'BANCO DE BOGOTA'],
  PERU: ['BCP', 'INTERBANK'],
  BAHAMAS: ['FIRSTCARIBBEAN', 'SCOTIABANK'],
  MEXICO: ['BBVA MEXICO', 'BANORTE', 'CITIBANAMEX'],
  BRAZIL: ['ITAU', 'BRADESCO', 'BANCO DO BRASIL'],
};

const BIN_PREFIX: Record<string, string[]> = {
  VISA: ['4'],
  MASTERCARD: ['51', '52', '53', '54', '55'],
  'AMERICAN EXPRESS': ['34', '37'],
  DISCOVER: ['6011', '65'],
};

function seeded(i: number) {
  let x = (i * 1103515245 + 12345) >>> 0;
  return () => {
    x = (x * 1103515245 + 12345) >>> 0;
    return x / 0xffffffff;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function makeBin(brand: string, i: number): string {
  const prefixes = BIN_PREFIX[brand] || ['4'];
  const prefix = prefixes[i % prefixes.length];
  const need = brand === 'AMERICAN EXPRESS' ? 15 : 6;
  let rest = '';
  let n = i * 7919 + 100000;
  while ((prefix + rest).length < need) {
    rest += String(n % 10);
    n = Math.floor(n / 7) + i;
  }
  return (prefix + rest).slice(0, need);
}

function makeZip(country: string, i: number): string {
  if (country === 'USA') return String(10000 + (i * 37) % 89999).padStart(5, '0');
  if (country === 'UK') {
    const letter = String.fromCharCode(65 + (i % 26));
    return `SW${(i % 20) + 1}${letter} ${(i % 9) + 1}AA`;
  }
  if (country === 'CANADA') {
    const letter = String.fromCharCode(65 + (i % 26));
    return `M${(i % 9) + 1}${letter}${(i % 9)}`;
  }
  if (country === 'GERMANY') return String(10000 + (i * 41) % 89999);
  return String(1000 + (i * 13) % 8999);
}

function priceFor(i: number): number {
  const cents = 500 + (i * 17) % 2001;
  return Math.round(cents) / 100;
}

function generateCatalog(count = 1300): Product[] {
  const list: Product[] = [];
  const now = '2026-01-01T00:00:00.000Z';

  for (let i = 0; i < count; i++) {
    const rng = seeded(i + 1);
    const country = COUNTRIES[i % COUNTRIES.length];
    const brand = BRANDS[i % BRANDS.length];
    const level = pick(rng, LEVELS);
    const card_type = pick(rng, TYPES);
    const issuers = ISSUERS[country] || ['LOCAL BANK'];
    const issuer = issuers[i % issuers.length];
    const bin = makeBin(brand, i);
    const price = priceFor(i);
    const zip_code = makeZip(country, i);
    const name = `${brand} ${level} · ${bin}`;
    const category = brand;
    const description = `${brand} ${card_type} ${level} issued by ${issuer} (${country}). ZIP ${zip_code}.`;

    list.push({
      id: `prod_${String(i + 1).padStart(4, '0')}`,
      bin,
      country,
      brand,
      card_type,
      card_level: level,
      issuer,
      price,
      zip_code,
      stock: 1 + (i % 25),
      name,
      category,
      description,
      image: '',
      status: 'active',
      created_at: now,
      updated_at: now,
    });
  }
  return list;
}

export const CATALOG: Product[] = generateCatalog(1300);

export const FILTER_OPTIONS = {
  brands: [...new Set(CATALOG.map((p) => p.brand))].sort(),
  cardTypes: [...new Set(CATALOG.map((p) => p.card_type))].sort(),
  cardLevels: [...new Set(CATALOG.map((p) => p.card_level))].sort(),
  countries: [...new Set(CATALOG.map((p) => p.country))].sort(),
  issuers: [...new Set(CATALOG.map((p) => p.issuer))].sort(),
} as const;

const CARDS_KEY = 'em_admin_cards';

export function loadAdminCards(): Product[] {
  try {
    const raw = localStorage.getItem(CARDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch { /* ignore */ }
  return CATALOG;
}

export function saveAdminCards(cards: Product[]) {
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}
