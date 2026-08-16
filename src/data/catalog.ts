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

/** Numeric postal / ZIP codes only (digits only — no letters). */
const ZIP_SAMPLES: Record<string, string[]> = {
  USA: [
    '10001', '10011', '90210', '90001', '60601', '60614', '33101', '33139',
    '75201', '77001', '98101', '98109', '02108', '02139', '30301', '30309',
    '85001', '85004', '19103', '19107', '94102', '94105', '80202', '80203',
  ],
  UK: ['10001', '20001', '30001', '40001', '50001', '60001', '70001', '80001'],
  CANADA: ['10001', '20001', '30001', '40001', '50001', '60001', '70001', '80001'],
  GERMANY: [
    '10115', '10117', '80331', '80333', '20095', '20099', '50667', '50668',
    '60311', '60313', '70173', '70174', '01067', '01069', '40213', '40215',
  ],
  FRANCE: [
    '75001', '75008', '69001', '69002', '13001', '13002', '31000', '31001',
    '44000', '44001', '67000', '67001', '33000', '33001',
  ],
  ITALY: [
    '00118', '00187', '20121', '20122', '10121', '10123', '50123', '50122',
    '80121', '80133', '40121', '40124',
  ],
  SPAIN: [
    '28001', '28013', '08001', '08002', '41001', '41004', '46001', '46002',
    '29001', '29015', '50001', '50005',
  ],
  AUSTRALIA: ['2000', '2001', '3000', '3004', '4000', '4001', '5000', '5001', '6000', '6001', '7000', '7001'],
  BELGIUM: ['1000', '1001', '2000', '2018', '9000', '9001', '4000', '4020', '3000', '3001'],
  NETHERLANDS: ['1011', '1012', '3011', '3012', '3511', '3512', '6211', '6212', '9711', '9712'],
  COLOMBIA: ['110111', '110221', '050001', '050010', '760001', '760010', '680001', '680002'],
  PERU: ['15001', '15074', '04001', '04002', '20001', '20002', '07001', '07006'],
  BAHAMAS: ['4805', '3732', '1086', '7776'],
  MEXICO: ['01000', '01020', '06000', '06600', '44100', '44150', '64000', '64010', '22000', '22010'],
  BRAZIL: [
    '01001000', '01310100', '20040020', '20031170', '30130000', '30190002',
    '80010000', '80250030', '90010150', '90020009',
  ],
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

/** Country-correct postal / ZIP format (digits only). */
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
  zips: [...new Set(CATALOG.map((p) => p.zip_code))].sort(),
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
