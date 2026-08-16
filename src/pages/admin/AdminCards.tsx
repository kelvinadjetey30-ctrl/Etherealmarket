import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { loadAdminCards, saveAdminCards } from '@/data/catalog';
import type { Product } from '@/types';

const CATEGORIES = ['VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DISCOVER', 'Anime', 'Sports', 'Pokemon'];

type FormState = {
  name: string; category: string; description: string; price: number; stock: number; image: string;
  bin: string; country: string; brand: string; card_type: string; card_level: string; issuer: string;
  zip_code: string; status: 'active' | 'inactive';
};

const emptyForm: FormState = {
  name: '', category: 'VISA', description: '', price: 10, stock: 10, image: '',
  bin: '', country: 'USA', brand: 'VISA', card_type: 'CREDIT', card_level: 'CLASSIC',
  issuer: 'CHASE BANK', zip_code: '10001', status: 'active',
};

export default function AdminCards() {
  const [cards, setCards] = useState<Product[]>(() => loadAdminCards());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return cards;
    return cards.filter((c) =>
      [c.name, c.bin, c.brand, c.category, c.country].join(' ').toLowerCase().includes(s)
    );
  }, [cards, q]);

  const persist = (next: Product[]) => {
    setCards(next);
    saveAdminCards(next);
  };

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm }); setOpen(true); };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name || `${p.brand} ${p.card_level}`, category: p.category || p.brand,
      description: p.description || '', price: p.price, stock: p.stock ?? 1, image: p.image || '',
      bin: p.bin, country: p.country, brand: p.brand, card_type: p.card_type, card_level: p.card_level,
      issuer: p.issuer, zip_code: p.zip_code || '', status: p.status === 'inactive' ? 'inactive' : 'active',
    });
    setOpen(true);
  };

  const save = () => {
    const now = new Date().toISOString();
    if (editing) {
      persist(cards.map((c) => c.id === editing.id ? { ...c, ...form, brand: form.brand || form.category, updated_at: now } : c));
    } else {
      const row: Product = {
        id: `prod_${Date.now()}`,
        bin: form.bin || String(400000 + (cards.length % 99999)),
        country: form.country, brand: form.brand || form.category, card_type: form.card_type,
        card_level: form.card_level, issuer: form.issuer, price: Number(form.price) || 5,
        zip_code: form.zip_code, stock: Number(form.stock) || 1,
        name: form.name || `${form.brand} ${form.card_level}`, category: form.category,
        description: form.description, image: form.image, status: form.status,
        created_at: now, updated_at: now,
      };
      persist([row, ...cards]);
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this card listing?')) return;
    persist(cards.filter((c) => c.id !== id));
  };

  const toggle = (id: string) => {
    persist(cards.map((c) => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active', updated_at: new Date().toISOString() } : c));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text">Manage Card Listings</h1>
          <p className="text-sm text-muted">{cards.length} total · showing {filtered.length}</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4" /> Add New Card</Button>
      </div>

      <Input placeholder="Search BIN, name, brand, country…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md" />

      <Card className="overflow-x-auto p-0 border border-border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-2 text-left text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Image</th>
              <th className="px-3 py-2 font-medium">Card Name</th>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Price $</th>
              <th className="px-3 py-2 font-medium">Stock</th>
              <th className="px-3 py-2 font-medium">ZIP</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 200).map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-surface">
                <td className="px-3 py-2">
                  {c.image ? <img src={c.image} alt="" className="h-8 w-12 rounded object-cover" /> : (
                    <div className="h-8 w-12 rounded bg-blue-50 flex items-center justify-center text-[10px] text-accent font-mono">{(c.brand || '').slice(0, 3)}</div>
                  )}
                </td>
                <td className="px-3 py-2">
                  <p className="font-medium truncate max-w-[180px]">{c.name || c.bin}</p>
                  <p className="text-xs text-muted font-mono">{c.bin}</p>
                </td>
                <td className="px-3 py-2">{c.category || c.brand}</td>
                <td className="px-3 py-2 font-medium">{formatPrice(c.price)}</td>
                <td className="px-3 py-2">{c.stock ?? 1}</td>
                <td className="px-3 py-2 font-mono text-xs">{c.zip_code}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{c.status}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-surface-2 text-accent" title="Edit"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => toggle(c.id)} className="p-1.5 rounded hover:bg-surface-2 text-muted" title="Toggle">
                      {c.status === 'active' ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                    </button>
                    <button type="button" onClick={() => remove(c.id)} className="p-1.5 rounded hover:bg-red-50 text-danger" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 200 && <p className="px-3 py-2 text-xs text-muted border-t border-border">Showing first 200 matches. Use search to narrow.</p>}
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white border border-border shadow-xl p-5 space-y-3">
            <h2 className="text-lg font-semibold">{editing ? 'Edit Card' : 'Add New Card'}</h2>
            <Input label="Card Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="block text-sm">
              <span className="text-muted mb-1 block">Category</span>
              <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, brand: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-muted mb-1 block">Description</span>
              <textarea className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Price USD" type="number" step="0.01" min={5} max={25} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <Input label="Stock" type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            </div>
            <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="BIN" value={form.bin} onChange={(e) => setForm({ ...form, bin: e.target.value })} />
              <Input label="ZIP Code" value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              <Input label="Issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Card Type" value={form.card_type} onChange={(e) => setForm({ ...form, card_type: e.target.value })} />
              <Input label="Card Level" value={form.card_level} onChange={(e) => setForm({ ...form, card_level: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.status === 'active'} onChange={(e) => setForm({ ...form, status: e.target.checked ? 'active' : 'inactive' })} />
              Active
            </label>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={save}>Save</Button>
              <Button variant="secondary" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
