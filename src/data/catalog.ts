import type { Product } from '@/types';
import { ISSUERS_ALL } from './issuers';

const COUNTRIES = [
  'USA', 'UK', 'CANADA', 'GERMANY', 'FRANCE', 'ITALY', 'SPAIN', 'AUSTRALIA',
  'BELGIUM', 'NETHERLANDS', 'COLOMBIA', 'PERU', 'BAHAMAS', 'MEXICO', 'BRAZIL',
] as const;

/** Brand → only matching card types (no cross-network mismatch). */
const TYPES_BY_BRAND: Record<string, readonly string[]> = {
  VISA: [
    'CREDIT BUSINESS', 'CREDIT CLASSIC', 'CREDIT PERSONAL', 'CREDIT SIGNATURE',
    'CREDIT TRADITIONAL', 'CREDIT TRADITIONAL REWARDS', 'CREDIT VISA TRADITIONAL',
    'DEBIT BUSINESS', 'DEBIT CLASSIC', 'DEBIT ELECTRON', 'DEBIT PERSONAL',
    'DEBIT PREPAID ANONYMOUS', 'DEBIT PREPAID CLASSIC', 'DEBIT PREPAID RELOADABLE',
    'DEBIT VISA CLASSIC', 'PREPAID VISA CLASSIC',
    'VISA - CREDIT - BUSINESS', 'VISA - CREDIT - CLASSIC', 'VISA - CREDIT - REWARDS',
    'VISA - CREDIT - SIGNATURE', 'VISA - DEBIT - BUSINESS', 'VISA - DEBIT - CLASSIC',
    'VISA - DEBIT - ELECTRON',
  ],
  MASTERCARD: [
    'CREDIT MASTERCARD BUSINESSCARD CARD', 'CREDIT MASTERCARD STANDARD',
    'CREDIT PLATINUM MASTERCARD', 'CREDIT WORLD ELITE MASTERCARD CARD',
    'CREDIT WORLD MASTERCARD CARD', 'CREDIT WORLD MASTERCARD FOR BUSINESS',
    'DEBIT DEBIT MASTERCARD', 'DEBIT DEBIT MASTERCARD ENHANCED',
    'DEBIT DEBIT MASTERCARD (ENHANCED)', 'DEBIT DEBIT MASTERCARD BUSINESSCARD CARD',
    'DEBIT GOLD', 'DEBIT PREPAID MASTERCARD CONSUMER INCENTIVE CARD',
    'DEBIT PREPAID MASTERCARD EMPLOYEE INCENTIVE CARD',
    'DEBIT PREPAID MASTERCARD FLEX BENEFIT CARD',
    'DEBIT PREPAID MASTERCARD GENERAL SPEND CARD',
    'DEBIT PREPAID MASTERCARD GIFT CARD',
    'DEBIT PREPAID MASTERCARD GOVERNMENT CARD',
    'DEBIT PREPAID MASTERCARD INSURANCE CARD',
    'DEBIT PREPAID MASTERCARD PAYROLL CARD',
    'DEBIT PREPAID MASTERCARD UNEMBOSSED',
    'DEBIT PREPAID MASTERCARD WORKPLACE B2B SOLUTIONS',
    'DEBIT WORLD DEBIT MASTERCARD EMBOSSED',
    'MASTERCARD - CREDIT - BUSINESS', 'MASTERCARD - CREDIT - GOLD',
    'MASTERCARD - CREDIT - PLATINUM', 'MASTERCARD - CREDIT - STANDARD',
    'MASTERCARD - DEBIT -', 'MASTERCARD - DEBIT - BUSINESS',
    'MASTERCARD - DEBIT - GOLD', 'MASTERCARD - DEBIT - STANDARD',
  ],
  CREDIT: [
    'CREDIT BUSINESS', 'CREDIT CLASSIC', 'CREDIT PERSONAL', 'CREDIT SIGNATURE',
    'CREDIT TRADITIONAL', 'CREDIT TRADITIONAL REWARDS', 'CREDIT PURCHASING',
    'CREDIT PURCHASING WITH FLEET', 'CREDIT DEBIT BUSINESSCARD',
  ],
  DEBIT: [
    'DEBIT BUSINESS', 'DEBIT CLASSIC', 'DEBIT ELECTRON', 'DEBIT GOLD',
    'DEBIT PERSONAL', 'DEBIT PREPAID ANONYMOUS', 'DEBIT PREPAID CLASSIC',
    'DEBIT PREPAID RELOADABLE',
  ],
  PREPAID: [
    'DEBIT PREPAID ANONYMOUS', 'DEBIT PREPAID CLASSIC', 'DEBIT PREPAID RELOADABLE',
    'PREPAID VISA CLASSIC',
  ],
  'N/A': [
    'CREDIT TRADITIONAL', 'DEBIT CLASSIC', 'CREDIT PERSONAL',
  ],
};

const BRANDS = ['VISA', 'MASTERCARD', 'CREDIT', 'DEBIT', 'PREPAID', 'N/A'] as const;

const BIN_PREFIX: Record<string, string[]> = {
  VISA: ['4'],
  MASTERCARD: ['51', '52', '53', '54', '55'],
  CREDIT: ['4', '51'],
  DEBIT: ['4', '52'],
  PREPAID: ['4', '51', '6011'],
  'N/A': ['4'],
};

function levelFromType(cardType: string, i: number): string {
  const t = cardType.toUpperCase();
  if (t.includes('WORLD ELITE')) return 'WORLD ELITE';
  if (t.includes('WORLD')) return 'WORLD MASTERCARD';
  if (t.includes('PLATINUM')) return 'PLATINUM';
  if (t.includes('SIGNATURE')) return 'SIGNATURE';
  if (t.includes('GOLD')) return 'GOLD';
  if (t.includes('BUSINESS') || t.includes('PURCHASING')) return 'BUSINESS';
  if (t.includes('PREPAID') || t.includes('GIFT') || t.includes('PAYROLL')) return 'PREPAID';
  if (t.includes('DEBIT') || t.includes('ELECTRON')) return i % 2 === 0 ? 'DEBIT' : 'CLASSIC';
  if (t.includes('CREDIT')) return i % 3 === 0 ? 'CREDIT' : 'CLASSIC';
  return 'CLASSIC';
}

function makeUniqueZip(country: string, i: number, used: Set<string>): string {
  let attempt = 0;
  while (attempt < 100000) {
    const n = (i * 9973 + attempt * 7919 + 17) >>> 0;
    let zip: string;
    switch (country) {
      case 'USA':
        zip = String(10000 + (n % 89999)).padStart(5, '0');
        break;
      case 'UK': {
        const areas = ['SW', 'SE', 'NW', 'NE', 'EC', 'WC', 'W', 'E', 'N', 'S', 'B', 'M', 'G', 'L', 'EH', 'CF', 'BS', 'LS'];
        const area = areas[n % areas.length];
        const district = String((n >> 4) % 20 || 1);
        const sector = String((n >> 8) % 9 || 1);
        const unitLetters = 'ABDEFGHJLNPQRSTUWXYZ';
        const u1 = unitLetters[(n >> 12) % unitLetters.length];
        const u2 = unitLetters[(n >> 16) % unitLetters.length];
        const sub = ((n >> 20) % 3 === 0) ? unitLetters[(n >> 22) % 8] : '';
        zip = `${area}${district}${sub} ${sector}${u1}${u2}`;
        break;
      }
      case 'CANADA': {
        const L1 = 'ABCEGHJKLMNPRSTVXY';
        const L2 = 'ABCEGHJKLMNPRSTVWXYZ';
        zip = `${L1[n % L1.length]}${(n >> 4) % 10}${L2[(n >> 8) % L2.length]} ${(n >> 12) % 10}${L2[(n >> 16) % L2.length]}${(n >> 20) % 10}`;
        break;
      }
      case 'NETHERLANDS': {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        zip = `${String(1000 + (n % 9000)).padStart(4, '0')} ${letters[(n >> 8) % 26]}${letters[(n >> 16) % 26]}`;
        break;
      }
      case 'AUSTRALIA':
        zip = String(200 + (n % 9800)).padStart(4, '0');
        break;
      case 'BELGIUM':
        zip = String(1000 + (n % 9000)).padStart(4, '0');
        break;
      case 'COLOMBIA':
        zip = String(100000 + (n % 900000)).padStart(6, '0');
        break;
      case 'BAHAMAS':
        zip = `N-${String(1000 + (n % 9000)).padStart(4, '0')}`;
        break;
      case 'BRAZIL': {
        const body = String(10000000 + (n % 89999999)).padStart(8, '0');
        zip = `${body.slice(0, 5)}-${body.slice(5)}`;
        break;
      }
      default:
        zip = String(1000 + (n % 98999)).padStart(5, '0');
    }
    if (!used.has(zip)) {
      used.add(zip);
      return zip;
    }
    attempt++;
  }
  const fallback = `${country}-${i}`;
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

function generateCatalog(count = 3000): Product[] {
  const list: Product[] = [];
  const usedBins = new Set<string>();
  const usedZips = new Set<string>();
  const now = '2026-01-01T00:00:00.000Z';

  for (let i = 0; i < count; i++) {
    const country = COUNTRIES[i % COUNTRIES.length];
    const brand = BRANDS[i % BRANDS.length];
    const typePool = TYPES_BY_BRAND[brand] || TYPES_BY_BRAND.VISA;
    const card_type = typePool[i % typePool.length];
    const level = levelFromType(card_type, i);
    const issuer = ISSUERS_ALL[i % ISSUERS_ALL.length];
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

export const CATALOG: Product[] = generateCatalog(3000);

export const FILTER_OPTIONS = {
  brands: [...BRANDS].sort(),
  cardTypes: [...new Set(Object.values(TYPES_BY_BRAND).flat())].sort(),
  cardLevels: [
    'BUSINESS', 'CLASSIC', 'CREDIT', 'DEBIT', 'GOLD', 'PLATINUM',
    'PREPAID', 'SIGNATURE', 'TRADITIONAL', 'WORLD ELITE', 'WORLD MASTERCARD',
  ].sort(),
  countries: [...COUNTRIES].sort(),
  issuers: [...ISSUERS_ALL].sort(),
} as const;

const CARDS_KEY = 'em_admin_cards';

export function loadAdminCards(): Product[] {
  try {
    const raw = localStorage.getItem(CARDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length >= 1000) {
        const seenBin = new Set<string>();
        const seenZip = new Set<string>();
        const unique = parsed.filter((p) => {
          if (!p.bin || seenBin.has(p.bin)) return false;
          if (!p.zip_code || seenZip.has(p.zip_code)) return false;
          seenBin.add(p.bin);
          seenZip.add(p.zip_code);
          return true;
        });
        if (unique.length >= 1000) return unique;
      }
    }
  } catch { /* ignore */ }
  return CATALOG;
}

export function saveAdminCards(cards: Product[]) {
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}
