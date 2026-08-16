import { useState, FormEvent } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { CRYPTO_OPTIONS, getWalletAddress, usdToCrypto, type CryptoOption } from '@/lib/crypto';
import { formatPrice } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { CryptoIcon } from '@/components/crypto/CryptoIcon';
import { Copy, Check } from 'lucide-react';

const DEPOSITS_KEY = 'em_deposits';

export default function Deposit() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [selected, setSelected] = useState<CryptoOption | null>(null);
  const [step, setStep] = useState<'form' | 'crypto' | 'pay'>('form');
  const [txid, setTxid] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const usd = parseFloat(amount) || 0;
  const cryptoAmount = selected ? usdToCrypto(usd, selected.rateUsd, selected.symbol) : 0;
  const wallet = selected ? getWalletAddress(selected.envKey) : '';

  const startDeposit = (e: FormEvent) => {
    e.preventDefault();
    if (usd < 1) return;
    setStep('crypto');
  };

  const submitProof = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !txid.trim() || !selected) return;
    const deposits = JSON.parse(localStorage.getItem(DEPOSITS_KEY) || '[]');
    deposits.push({
      id: `dep_${Date.now()}`,
      user_id: user.id,
      amount_usd: usd,
      crypto_type: selected.id,
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

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold">Deposit</h1>
        {submitted ? (
          <Card className="text-center space-y-3">
            <p className="text-success font-medium">Payment Submitted. Waiting for admin approval.</p>
            <Button onClick={() => { setStep('form'); setSubmitted(false); setAmount(''); setTxid(''); setSelected(null); }}>New deposit</Button>
          </Card>
        ) : step === 'form' ? (
          <Card>
            <form onSubmit={startDeposit} className="space-y-4">
              <Input label="Amount (USD)" type="number" min="1" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="50.00" />
              <Button type="submit" className="w-full" disabled={usd < 1}>Continue</Button>
            </form>
          </Card>
        ) : step === 'crypto' ? (
          <Card className="space-y-3">
            <p className="text-sm font-medium">Choose Crypto</p>
            <div className="grid grid-cols-2 gap-2">
              {CRYPTO_OPTIONS.map((c) => (
                <button key={c.id} type="button" onClick={() => { setSelected(c); setStep('pay'); }}
                  className="rounded-lg border border-border bg-surface-2 px-3 py-3 text-left text-sm hover:border-accent/50 flex items-center gap-2">
                  <CryptoIcon option={c} size={32} />
                  <span><span className="font-semibold text-accent-light block">{c.symbol}</span><span className="text-xs text-muted">{c.name}</span></span>
                </button>
              ))}
            </div>
            <Button variant="ghost" className="w-full" onClick={() => setStep('form')}>Back</Button>
          </Card>
        ) : selected ? (
          <Card className="space-y-5">
            <div className="flex items-center gap-3">
              <CryptoIcon option={selected} size={40} />
              <div><p className="font-medium">{selected.name}</p><p className="text-xs text-muted">{selected.network}</p></div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted">Send exactly</p>
              <p className="text-2xl font-semibold text-accent-light">{cryptoAmount} {selected.symbol}</p>
              <p className="text-sm text-muted">≈ {formatPrice(usd)}</p>
            </div>
            <div className="flex justify-center"><div className="rounded-xl bg-white p-3"><QRCodeSVG value={wallet} size={160} /></div></div>
            <div>
              <p className="mb-1 text-xs text-muted">Admin Wallet Address</p>
              <p className="break-all rounded-lg bg-surface-2 px-3 py-2 font-mono text-xs">{wallet}</p>
              <Button type="button" size="sm" variant="secondary" className="mt-2" onClick={copyAddress}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className="text-xs text-warning">Send the exact amount on {selected.network} only. Wrong network = funds will be lost.</p>
            <form onSubmit={submitProof} className="space-y-3">
              <Input label="TXID / Transaction Hash" value={txid} onChange={(e) => setTxid(e.target.value)} required placeholder="Paste TXID" />
              <Button type="submit" className="w-full">Submit Payment</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep('crypto')}>Back</Button>
            </form>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
