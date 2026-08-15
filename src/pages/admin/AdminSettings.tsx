import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CRYPTO_OPTIONS, getWalletAddress } from '@/lib/crypto';

const WALLETS_KEY = 'em_admin_wallets';

export default function AdminSettings() {
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
      <h1 className="text-xl font-semibold">Settings</h1>

      <Card className="space-y-4">
        <div>
          <h2 className="font-medium">Admin Wallets</h2>
          <p className="text-xs text-muted mt-1">
            Set deposit addresses shown to customers. Never store private keys here.
            USDT uses TRC20 to keep fees low.
          </p>
        </div>

        <div className="space-y-3">
          {CRYPTO_OPTIONS.map((c) => (
            <div key={c.id}>
              <Input
                label={`${c.symbol} — ${c.name} (${c.network})`}
                value={wallets[c.envKey] || ''}
                onChange={(e) => setWallets({ ...wallets, [c.envKey]: e.target.value })}
                placeholder={c.envKey}
              />
            </div>
          ))}
        </div>

        <Button onClick={save}>{saved ? 'Saved' : 'Save wallets'}</Button>
      </Card>

      <Card className="space-y-3 text-sm">
        <p className="text-muted">
          Environment variables: <code className="text-accent-light">VITE_WALLET_BTC</code>,{' '}
          <code className="text-accent-light">VITE_WALLET_ETH</code>,{' '}
          <code className="text-accent-light">VITE_WALLET_SOL</code>,{' '}
          <code className="text-accent-light">VITE_WALLET_LTC</code>,{' '}
          <code className="text-accent-light">VITE_WALLET_TRX</code>,{' '}
          <code className="text-accent-light">VITE_WALLET_USDT_TRC20</code>
        </p>
        <p className="text-muted">
          Local demo admin: <code className="text-accent-light">admin@etherealmarket.demo</code> /{' '}
          <code className="text-accent-light">AdminDemo123!</code>
        </p>
      </Card>
    </div>
  );
}
