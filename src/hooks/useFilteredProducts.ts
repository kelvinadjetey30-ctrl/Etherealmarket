import { useMemo } from 'react';
import { loadAdminCards } from '@/data/catalog';
import type { FilterState, Product } from '@/types';

export function useFilteredProducts(filters: FilterState): Product[] {
  return useMemo(() => {
    const source = loadAdminCards();
    return source.filter((p) => {
      if (p.status !== 'active') return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const hay = [p.bin, p.country, p.brand, p.card_type, p.card_level, p.issuer, p.zip_code, p.name]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (filters.country.length && !filters.country.includes(p.country)) return false;
      if (filters.brand.length && !filters.brand.includes(p.brand)) return false;
      if (filters.cardType.length && !filters.cardType.includes(p.card_type)) return false;
      if (filters.cardLevel.length && !filters.cardLevel.includes(p.card_level)) return false;
      if (filters.issuer.length && !filters.issuer.includes(p.issuer)) return false;
      if (filters.zip?.length && !filters.zip.includes(p.zip_code)) return false;
      if (filters.bin?.length && !filters.bin.includes(p.bin)) return false;
      if (p.price < filters.priceMin || p.price > filters.priceMax) return false;

      return true;
    });
  }, [filters]);
}
