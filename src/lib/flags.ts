/** Country → flag emoji for storefront display */
export const COUNTRY_FLAGS: Record<string, string> = {
  USA: '🇺🇸',
  UK: '🇬🇧',
  CANADA: '🇨🇦',
  GERMANY: '🇩🇪',
  FRANCE: '🇫🇷',
  ITALY: '🇮🇹',
  SPAIN: '🇪🇸',
  AUSTRALIA: '🇦🇺',
  BELGIUM: '🇧🇪',
  NETHERLANDS: '🇳🇱',
  COLOMBIA: '🇨🇴',
  PERU: '🇵🇪',
  BAHAMAS: '🇧🇸',
  MEXICO: '🇲🇽',
  BRAZIL: '🇧🇷',
};

export function countryFlag(country: string): string {
  return COUNTRY_FLAGS[country] || '🏳️';
}
