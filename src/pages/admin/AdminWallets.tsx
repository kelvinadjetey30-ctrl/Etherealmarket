import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CryptoIcon } from '@/components/crypto/CryptoIcon';
import type { WalletEntry } from '@/types';

const WALLETS_LIST_KEY = 'em_wallets_list';

const COIN_OPTIONS = ['BTC', 'ETH', 'SOL', 'LTC', 'TRX', 'USDT', 'DOGE', 'XRP', 'BNB', 'ADA'];

const DEFAULT_WALLETS: WalletEntry[] = [
  { id: 'w1', coin: 'BTC', network: 'Bitcoin', address: 'bc1qy0uthkh50rdajnzlq8cqfgyea9fx3twtpcycqh', icon: 'BTC' },
  { id: 'w2', coin: 'ETH', network: 'Ethereum (ERC-20)', address: '0x9825ce02321860d248DDab72BC44A30810634E1E', icon: 'ETH' },
  { id: 'w3', coin: 'SOL', network: 'Solana', address: '9buLs73w2UqCWCwUPcqn2QitkZ2gJU5sUTzmkkNPcCyr', icon: 'SOL' },
  { id: 'w4', coin: 'LTC', network: 'Litecoin', address: 'ltc1qusj23jzqda7tq0lk578hl9xhz4hktrgq7pnyvq', icon: 'LTC' },
  { id: 'w5', coin: 'TRX', network: 'TRON', address: 'TRdhtFumJDc68QipY5YdWVXrPngjzEFN9V', icon: 'TRX' },
  { id: 'w6', coin: 'USDT', network: 'TRC20 (Tron)', address: 'TRdhtFumJDc68QipY5YdWVXrPngjzEFN9V', icon: 'USDT' },
];

function loadWallets(): WalletEntry[] {
  try {
    const raw = localStorage.getItem(WALLETS_LIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WalletEntry[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_WALLETS;
}

function saveWallets(list: WalletEntry[]) {
  localStorage.setItem(WALLETS_LIST_KEY, JSON.stringify(list));
  const map: Record<string, string> = {};
  list.forEach((w) => {
    const key =
      w.coin === 'USDT' ? 'VITE_WALLET_USDT_TRC20' : `VITE_WALLET_${w.coin}`;
    map[key] = w.address;
  });
  localStorage.setItem('em_admin_wallets', JSON.stringify(map));
}

export default function AdminWallets() {
  const [wallets, setWallets] = useState<WalletEntry[]>(() => loadWallets());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<WalletEntry | null>(null);
  const [form, setForm] = useState({ coin: 'BTC', network: 'Bitcoin', address: '' });

  const persist = (next: WalletEntry[]) => {
    setWallets(next);
    saveWallets(next);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ coin: 'BTC', network: 'Bitcoin', address: '' });
    setOpen(true);
  };

  const openEdit = (w: WalletEntry) => {
    setEditing(w);
    setForm({ coin: w.coin, network: w.network, address: w.address });
    setOpen(true);
  };

  const save = () => {
    if (!form.address.trim()) return alert('Wallet address required');
    if (editing) {
      persist(
        wallets.map((w) =>
          w.id === editing.id
            ? { ...w, coin: form.coin, network: form.network, address: form.address.trim(), icon: form.coin }
            : w
        )
      );
    } else {
      const row: WalletEntry = {
        id: `w_${Date.now()}`,
        coin: form.coin,
        network: form.network,
        address: form.address.trim(),
        icon: form.coin,
      };
      persist([...wallets, row]);
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this wallet?')) return;
    persist(wallets.filter((w) => w.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Manage Crypto Addresses</h1>
          <p className="text-sm text-muted">These wallets appear on checkout & deposit. Public addresses only.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add New Crypto
        </Button>
      </div>

      <Card className="overflow-x-auto p-0 border border-border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-2 text-left text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Coin</th>
              <th className="px-3 py-2 font-medium">Coin Name</th>
              <th className="px-3 py-2 font-medium">Network</th>
              <th className="px-3 py-2 font-medium">Wallet Address</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((w) => (
              <tr key={w.id} className="border-t border-border hover:bg-surface">
                <td className="px-3 py-2">
                  <CryptoIcon symbol={w.coin} />
                </td>
                <td className="px-3 py-2 font-medium">{w.coin}</td>
                <td className="px-3 py-2 text-muted">{w.network}</td>
                <td className="px-3 py-2 font-mono text-xs break-all max-w-[220px]">{w.address}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => openEdit(w)} className="p-1.5 rounded hover:bg-surface-2 text-accent">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => remove(w.id)} className="p-1.5 rounded hover:bg-red-50 text-danger">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white border border-border shadow-xl p-5 space-y-3">
            <h2 className="text-lg font-semibold">{editing ? 'Edit Crypto' : 'Add New Crypto'}</h2>
            <label className="block text-sm">
              <span className="text-muted mb-1 block">Coin Name</span>
              <select
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                value={form.coin}
                onChange={(e) => setForm({ ...form, coin: e.target.value })}
              >
                {COIN_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <Input
              label="Network"
              value={form.network}
              onChange={(e) => setForm({ ...form, network: e.target.value })}
              placeholder="e.g. Bitcoin, ERC20, TRC20, Solana"
            />
            <Input
              label="Wallet Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Public address only"
            />
            <div className="flex items-center gap-2 text-sm text-muted">
              <CryptoIcon symbol={form.coin} />
              Icon auto-selected for {form.coin}
            </div>
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
