import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CRYPTO_OPTIONS, getWalletAddress } from '@/lib/crypto';
import { CryptoIcon } from '@/components/crypto/CryptoIcon';
import { FILTER_OPTIONS, CATALOG } from '@/data/catalog';

const WALLETS_KEY = 'em_admin_wallets';

export default function AdminTaxonomies() {
  const [wallets, setWallets] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(WALLETS_KEY) || '{}');
    const initial: Record<string, string> = {};
    CRYPTO_OPTIONS.forEach((c) => {
      initial[c.envKey] = stored[c.envKey] || getWalletAddress(c.envKey);
    });
    setWallets(initial);
  }, []);

  const save = () => {
    localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Taxonomies & Wallets</h1>

      <Card className="space-y-4">
        <div>
          <h2 className="font-medium">Crypto addresses</h2>
          <p className="text-xs text-muted mt-1">
            Admin deposit wallets shown at checkout. Public addresses only — never private keys.
          </p>
        </div>
        <div className="space-y-4">
          {CRYPTO_OPTIONS.map((c) => (
            <div key={c.id} className="flex gap-3 items-start">
              <CryptoIcon option={c} size={36} />
              <div className="flex-1">
                <Input
                  label={`${c.symbol} — ${c.name} (${c.network})`}
                  value={wallets[c.envKey] || ''}
                  onChange={(e) => setWallets({ ...wallets, [c.envKey]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
        <Button onClick={save}>{saved ? 'Saved' : 'Save wallets'}</Button>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-medium">Catalog taxonomies</h2>
        <p className="text-xs text-muted">{CATALOG.length} active listings</p>
        {(
          [
            ['Countries', FILTER_OPTIONS.countries],
            ['Brands', FILTER_OPTIONS.brands],
            ['Card levels', FILTER_OPTIONS.cardLevels],
            ['Issuers', FILTER_OPTIONS.issuers],
          ] as const
        ).map(([label, items]) => (
          <div key={label}>
            <p className="text-xs text-muted uppercase tracking-wide mb-1.5">{label}</p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <span key={item} className="rounded-md border border-border bg-surface-2 px-2 py-1 text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
