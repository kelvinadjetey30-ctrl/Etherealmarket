import { useState, useMemo } from 'react';
import { CATALOG } from '@/data/catalog';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const products = useMemo(() => {
    if (!search) return CATALOG;
    const q = search.toLowerCase();
    return CATALOG.filter((p) =>
      [p.bin, p.country, p.brand, p.card_type, p.card_level, p.issuer].join(' ').toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Products</h1>
        <Input placeholder="Search listings…" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
      </div>
      <p className="text-sm text-muted">{products.length} listings</p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 text-xs text-muted uppercase">
            <tr>
              <th className="px-3 py-2">BIN</th>
              <th className="px-3 py-2">Country</th>
              <th className="px-3 py-2">Brand</th>
              <th className="px-3 py-2">Level</th>
              <th className="px-3 py-2">Issuer</th>
              <th className="px-3 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 100).map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-surface-2/50">
                <td className="px-3 py-2 font-mono text-accent-light">{p.bin}</td>
                <td className="px-3 py-2">{p.country}</td>
                <td className="px-3 py-2">{p.brand}</td>
                <td className="px-3 py-2">{p.card_level}</td>
                <td className="px-3 py-2">{p.issuer}</td>
                <td className="px-3 py-2">{formatPrice(p.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length > 100 && <p className="text-xs text-muted">Showing first 100 of {products.length}</p>}
    </div>
  );
}
