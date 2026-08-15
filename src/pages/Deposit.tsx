import { useState, FormEvent } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { WALLET_ADDRESSES, usdToCrypto } from '@/lib/crypto';
import { formatPrice } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';

const CRYPTO_TYPES = ['BTC', 'USDT-TRC20', 'USDT-ERC20', 'ETH'] as const;
const DEPOSITS_KEY = 'em_deposits';

export default function Deposit() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [crypto, setCrypto] = useState<typeof CRYPTO_TYPES[number]>('USDT-TRC20');
  const [step, setStep] = useState<'form' | 'pay'>('form');
  const [txid, setTxid] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const usd = parseFloat(amount) || 0;
  const cryptoAmount = usdToCrypto(usd, crypto);
  const wallet = WALLET_ADDRESSES[crypto];

  const startDeposit = (e: FormEvent) => {
    e.preventDefault();
    if (usd < 1) return;
    setStep('pay');
  };

  const submitProof = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !txid.trim()) return;
    const deposits = JSON.parse(localStorage.getItem(DEPOSITS_KEY) || '[]');
    deposits.push({
      id: `dep_${Date.now()}`,
      user_id: user.id,
      amount_usd: usd,
      crypto_type: crypto,
      crypto_amount: cryptoAmount,
      wallet_address: wallet,
      txid: txid.trim(),
      proof_url: null,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(DEPOSITS_KEY, JSON.stringify(deposits));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold">Deposit</h1>

        {submitted ? (
          <Card className="text-center space-y-3">
            <p className="text-success font-medium">Deposit request submitted</p>
            <p className="text-sm text-muted">
              An admin will verify your transaction and credit your balance.
            </p>
            <Button onClick={() => { setStep('form'); setSubmitted(false); setAmount(''); setTxid(''); }}>
              New deposit
            </Button>
          </Card>
        ) : step === 'form' ? (
          <Card>
            <form onSubmit={startDeposit} className="space-y-4">
              <Input
                label="Amount (USD)"
                type="number"
                min="1"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50.00"
              />
              <div>
                <p className="mb-1.5 text-sm font-medium text-muted">Crypto</p>
                <div className="grid grid-cols-2 gap-2">
                  {CRYPTO_TYPES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCrypto(c)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        crypto === c
                          ? 'border-accent bg-accent/15 text-accent-light'
                          : 'border-border bg-surface-2 text-muted hover:text-text'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={usd < 1}>
                Continue
              </Button>
            </form>
          </Card>
        ) : (
          <Card className="space-y-5">
            <div className="text-center">
              <p className="text-sm text-muted">Send exactly</p>
              <p className="text-2xl font-semibold text-accent-light">
                {cryptoAmount} {crypto.split('-')[0]}
              </p>
              <p className="text-sm text-muted">≈ {formatPrice(usd)}</p>
            </div>

            <div className="flex justify-center">
              <div className="rounded-xl bg-white p-3">
                <QRCodeSVG value={wallet} size={160} />
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs text-muted">Wallet address</p>
              <p className="break-all rounded-lg bg-surface-2 px-3 py-2 font-mono text-xs">{wallet}</p>
            </div>

            <p className="text-xs text-warning text-center">
              Send the exact amount. Incomplete or incorrect amounts may delay verification.
            </p>

            <form onSubmit={submitProof} className="space-y-3">
              <Input
                label="Transaction ID (TXID)"
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
                placeholder="Paste TXID after sending"
                required
              />
              <Button type="submit" className="w-full">
                Submit for verification
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep('form')}>
                Back
              </Button>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
}
