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
  USA: ['CHASE BANK', 'BANK OF AMERICA', 'WELLS FARGO', 'CITI BANK', 'CAPITAL ONE', 'US BANK', 'AMERICAN EXPRESS', 'DISCOVER BANK', 'PNC BANK', 'TD BANK USA', 'NAVY FEDERAL'],
  UK: ['BARCLAYS', 'HSBC', 'LLOYDS BANK', 'NATWEST', 'SANTANDER', 'METRO BANK', 'TSB'],
  CANADA: ['RBC', 'TD BANK', 'SCOTIABANK', 'CIBC', 'BMO', 'NATIONAL BANK'],
  GERMANY: ['DEUTSCHE BANK', 'COMMERZBANK', 'DZ BANK', 'HYPOVEREINSBANK'],
  FRANCE: ['BNP PARIBAS', 'SOCIETE GENERALE', 'CREDIT AGRICOLE', 'CREDIT MUTUEL', 'LA BANQUE POSTALE'],
  ITALY: ['UNICREDIT', 'INTESA SANPAOLO', 'BANCO BPM', 'MONTE DEI PASCHI'],
  SPAIN: ['BBVA', 'SANTANDER', 'CAIXABANK', 'BANKINTER', 'SABADELL'],
  AUSTRALIA: ['ANZ', 'COMMONWEALTH BANK', 'WESTPAC', 'NAB', 'MACQUARIE'],
  BELGIUM: ['KBC BANK', 'ING BELGIUM', 'BNP PARIBAS FORTIS', 'BELFUS'],
  NETHERLANDS: ['ING', 'ABN AMRO', 'RABOBANK', 'SNS BANK'],
  COLOMBIA: ['BANCOLOMBIA', 'BANCO DE BOGOTA', 'DAVIVIENDA'],
  PERU: ['BCP', 'INTERBANK', 'BBVA PERU'],
  BAHAMAS: ['FIRSTCARIBBEAN', 'SCOTIABANK', 'COMMONWEALTH BANK BAHAMAS'],
  MEXICO: ['BBVA MEXICO', 'BANORTE', 'CITIBANAMEX', 'SANTANDER MEXICO'],
  BRAZIL: ['ITAU', 'BRADESCO', 'BANCO DO BRASIL', 'SANTANDER BRASIL', 'CAIXA'],
};

const BIN_PREFIX: Record<string, string[]> = {
  VISA: ['4'],
  MASTERCARD: ['51', '52', '53', '54', '55'],
  'AMERICAN EXPRESS': ['34', '37'],
  DISCOVER: ['6011', '65'],
};

function makeUniqueZip(country: string, i: number, used: Set<string>): string {
  let attempt = 0;
  while (attempt < 100000) {
    let zip: string;
    const n = i * 9973 + attempt * 7919 + 17;
    switch (country) {
      case 'USA':
      case 'UK':
        zip = String(10000 + (n % 89999)).padStart(5, '0');
        break;
      case 'CANADA': {
        const letters = 'ABCEGHJKLMNPRSTVXY';
        const letters2 = 'ABCEGHJKLMNPRSTVWXYZ';
        const a = letters[n % letters.length];
        const b = String(n % 10);
        const c = letters2[(n >> 3) % letters2.length];
        const d = String((n >> 5) % 10);
        const e = letters2[(n >> 7) % letters2.length];
        const f = String((n >> 9) % 10);
        zip = `${a}${b}${c} ${d}${e}${f}`;
        break;
      }
      case 'GERMANY':
      case 'FRANCE':
      case 'ITALY':
      case 'SPAIN':
      case 'PERU':
      case 'MEXICO':
        zip = String(1000 + (n % 89999)).padStart(5, '0');
        break;
      case 'AUSTRALIA':
        zip = String(200 + (n % 7800)).padStart(4, '0');
        break;
      case 'BELGIUM':
      case 'NETHERLANDS':
      case 'BAHAMAS':
        zip = String(1000 + (n % 8999)).padStart(4, '0');
        break;
      case 'COLOMBIA':
        zip = String(50000 + (n % 900000)).padStart(6, '0');
        break;
      case 'BRAZIL':
        zip = String(1000000 + (n % 89999999)).padStart(8, '0');
        break;
      default:
        zip = String(10000 + (n % 89999)).padStart(5, '0');
    }
    if (!used.has(zip)) {
      used.add(zip);
      return zip;
    }
    attempt++;
  }
  const fallback = `Z${i}-${attempt}`;
  used.add(fallback);
  return fallback;
}

function makeUniqueBin(brand: string, i: number, used: Set<string>): string {
  const prefixes = BIN_PREFIX[brand] || BIN_PREFIX.VISA;
  let attempt = 0;
  while (attempt < 50000) {
    const prefix = prefixes[(i + attempt) % prefixes.length];
    const need = 6 - prefix.length;
    const body = String((i * 7919 + attempt * 104729 + 13) % Math.pow(10, need)).padStart(need, '0');
    const bin = (prefix + body).slice(0, 6);
    if (!used.has(bin) && bin.length === 6) {
      used.add(bin);
      return bin;
    }
    attempt++;
  }
  const fallback = String(100000 + (i % 900000)).padStart(6, '0');
  used.add(fallback);
  return fallback;
}

function priceFor(i: number): number {
  return 5 + (i * 3) % 21;
}

function generateCatalog(count = 1300): Product[] {
  const list: Product[] = [];
  const usedBins = new Set<string>();
  const usedZips = new Set<string>();
  const now = '2026-01-01T00:00:00.000Z';

  for (let i = 0; i < count; i++) {
    const country = COUNTRIES[i % COUNTRIES.length];
    const brand = BRANDS[i % BRANDS.length];
    const level = LEVELS[i % LEVELS.length];
    const card_type = TYPES[(i * 3) % TYPES.length];
    const issuers = ISSUERS[country] || ['LOCAL BANK'];
    const issuer = issuers[(i + Math.floor(i / COUNTRIES.length)) % issuers.length];
    const bin = makeUniqueBin(brand, i, usedBins);
    const zip_code = makeUniqueZip(country, i, usedZips);
    const price = priceFor(i);
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
      if (Array.isArray(parsed) && parsed.length >= CATALOG.length) {
        const seenBin = new Set<string>();
        const seenZip = new Set<string>();
        const unique = parsed.filter((p) => {
          if (!p.bin || seenBin.has(p.bin)) return false;
          if (!p.zip_code || seenZip.has(p.zip_code)) return false;
          seenBin.add(p.bin);
          seenZip.add(p.zip_code);
          return true;
        });
        if (unique.length >= CATALOG.length * 0.9) return unique;
      }
    }
  } catch { /* ignore */ }
  return CATALOG;
}

export function saveAdminCards(cards: Product[]) {
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}
