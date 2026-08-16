import { useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { DashboardShortcuts } from '@/components/layout/DashboardShortcuts';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Filters } from '@/components/marketplace/Filters';
import { useFilteredProducts } from '@/hooks/useFilteredProducts';
import type { FilterState } from '@/types';

const defaultFilters: FilterState = {
  country: [],
  brand: [],
  cardType: [],
  cardLevel: [],
  issuer: [],
  zip: [],
  priceMin: 5,
  priceMax: 25,
  search: '',
};

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const products = useFilteredProducts(filters);

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <DashboardShortcuts />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search BIN, ZIP, country, brand, type, level, issuer…"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-surface-2 sm:hidden"
          >
            Filters {showFilters ? '▴' : '▾'}
          </button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className={`lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Filters filters={filters} onChange={setFilters} resultCount={products.length} />
          </aside>

          <div className="flex-1">
            {products.length === 0 ? (
              <div className="rounded-xl border border-border bg-white p-12 text-center text-muted shadow-sm">
                No products match your filters
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
