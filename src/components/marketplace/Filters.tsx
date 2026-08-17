import type { FilterState } from '@/types';
import { FILTER_OPTIONS } from '@/data/catalog';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { countryFlag } from '@/lib/flags';

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
}

function MultiSelect({
  label,
  options,
  selected,
  onToggle,
  tall,
  showFlags,
  showCount,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (v: string) => void;
  tall?: boolean;
  showFlags?: boolean;
  showCount?: boolean;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted uppercase tracking-wide">
        {label}
        {showCount && selected.length > 0 && (
          <span className="ml-1 normal-case text-accent">({selected.length} selected)</span>
        )}
      </p>
      <div className={`flex flex-wrap gap-1.5 overflow-y-auto ${tall ? 'max-h-48' : 'max-h-36'}`}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`rounded-md px-2 py-1 text-xs border transition-colors text-left ${
                active
                  ? 'bg-blue-50 border-accent text-accent'
                  : 'bg-white border-border text-muted hover:text-text'
              }`}
            >
              {showFlags ? (
                <span className="inline-flex items-center gap-1">
                  <span>{countryFlag(opt)}</span>
                  {opt}
                </span>
              ) : (
                opt
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Filters({ filters, onChange }: Props) {
  const toggle = (key: keyof FilterState, value: string) => {
    const arr = filters[key] as string[];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  const clear = () => {
    onChange({
      country: [],
      brand: [],
      cardType: [],
      cardLevel: [],
      issuer: [],
      zip: [],
      bin: [],
      priceMin: 5,
      priceMax: 25,
      search: filters.search,
    });
  };

  const hasFilters =
    filters.country.length ||
    filters.brand.length ||
    filters.cardType.length ||
    filters.cardLevel.length ||
    filters.issuer.length ||
    filters.zip.length ||
    filters.bin.length ||
    filters.priceMin > 5 ||
    filters.priceMax < 25;

  return (
    <div className="rounded-xl border border-border bg-white p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">Filters</p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clear}>
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted uppercase tracking-wide">Search BIN</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            inputMode="numeric"
            placeholder="e.g. 453987"
            value={filters.bin[0] || ''}
            onChange={(e) => {
              const v = e.target.value.trim();
              onChange({ ...filters, bin: v ? [v] : [] });
            }}
            className="w-full rounded-lg border border-border bg-white py-2 pl-8 pr-3 text-sm font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted uppercase tracking-wide">Search ZIP</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="e.g. 90210"
            value={filters.zip[0] || ''}
            onChange={(e) => {
              const v = e.target.value.trim();
              onChange({ ...filters, zip: v ? [v] : [] });
            }}
            className="w-full rounded-lg border border-border bg-white py-2 pl-8 pr-3 text-sm font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>
      </div>

      <MultiSelect label="Country" options={FILTER_OPTIONS.countries} selected={filters.country} onToggle={(v) => toggle('country', v)} showFlags showCount={filters.country.length > 0} />
      <MultiSelect label="Card Brand" options={FILTER_OPTIONS.brands} selected={filters.brand} onToggle={(v) => toggle('brand', v)} showCount={filters.brand.length > 0} />
      <MultiSelect label="Card Type" options={FILTER_OPTIONS.cardTypes} selected={filters.cardType} onToggle={(v) => toggle('cardType', v)} tall showCount={filters.cardType.length > 0} />
      <MultiSelect label="Card Level" options={FILTER_OPTIONS.cardLevels} selected={filters.cardLevel} onToggle={(v) => toggle('cardLevel', v)} showCount={filters.cardLevel.length > 0} />
      <MultiSelect label="Bank / Issuer" options={FILTER_OPTIONS.issuers} selected={filters.issuer} onToggle={(v) => toggle('issuer', v)} tall showCount={filters.issuer.length > 0} />

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted uppercase tracking-wide">Price</p>
        <div className="flex items-center gap-2">
          <input type="number" min={0} step={1} value={filters.priceMin || ''} placeholder="Min"
            onChange={(e) => onChange({ ...filters, priceMin: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-sm" />
          <span className="text-muted">–</span>
          <input type="number" min={0} step={1} value={filters.priceMax === 25 ? '' : filters.priceMax} placeholder="Max"
            onChange={(e) => onChange({ ...filters, priceMax: parseFloat(e.target.value) || 25 })}
            className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-sm" />
        </div>
      </div>
    </div>
  );
}
