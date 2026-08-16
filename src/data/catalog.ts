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

/** Public BIN ranges only (first 6 digits). Synthetic — not real full card numbers. */
const BIN_PREFIX: Record<string, string[]> = {
  VISA: ['400000', '411111', '424242', '453201', '453987', '454889', '491761'],
  MASTERCARD: ['510000', '510510', '520082', '530000', '542523', '545454', '555555'],
  'AMERICAN EXPRESS': ['340000', '341111', '370000', '371449', '378282'],
  DISCOVER: ['601100', '601111', '601120', '650000', '650010', '651000'],
};

/** Realistic postal-code samples by country (public format only). */
const ZIP_SAMPLES: Record<string, string[]> = {
  USA: ['10001', '90210', '60601', '33101', '75201', '98101', '02108', '30301', '85001', '19103'],
  UK: ['SW1A 1AA', 'EC1A 1BB', 'W1A 0AX', 'M1 1AE', 'B1 1AA', 'G1 1AA', 'EH1 1YZ', 'L1 8JQ'],
  CANADA: ['M5V 3L9', 'K1A 0B1', 'H2Y 1C6', 'V6B 1A1', 'T2P 1J9', 'R3C 0A5'],
  GERMANY: ['10115', '80331', '20095', '50667', '60311', '70173', '01067'],
  FRANCE: ['75001', '69001', '13001', '31000', '44000', '67000', '33000'],
  ITALY: ['00118', '20121', '10121', '50123', '80121', '40121'],
  SPAIN: ['28001', '08001', '41001', '46001', '29001', '50001'],
  AUSTRALIA: ['2000', '3000', '4000', '5000', '6000', '7000'],
  BELGIUM: ['1000', '2000', '9000', '4000', '3000'],
  NETHERLANDS: ['1011', '3011', '3511', '6211', '9711'],
  COLOMBIA: ['110111', '050001', '760001', '680001'],
  PERU: ['15001', '04001', '20001', '07001'],
  BAHAMAS: ['N-4805', 'N-3732', 'N-1086'],
  MEXICO: ['01000', '06000', '44100', '64000', '22000'],
  BRAZIL: ['01001-000', '20040-020', '30130-000', '80010-000', '90010-150'],
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

/** Always a valid 6-digit BIN for the brand (industry standard length). */
function makeBin(brand: string, i: number): string {
  const prefixes = BIN_PREFIX[brand] || BIN_PREFIX.VISA;
  const base = prefixes[i % prefixes.length];
  const suffix = String((i * 17 + 13) % 100).padStart(2, '0');
  return (base.slice(0, 4) + suffix).slice(0, 6);
}

/** Country-correct postal / ZIP format. */
function makeZip(country: string, i: number): string {
  const samples = ZIP_SAMPLES[country];
  if (samples?.length) return samples[i % samples.length];
  return String(10000 + (i * 41) % 89999).padStart(5, '0');
}

/** Whole-dollar prices $5–$25 displayed as n.00 */
function priceFor(i: number): number {
  return 5 + (i * 3) % 21;
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
