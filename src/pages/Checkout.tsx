import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { CRYPTO_OPTIONS, getWalletAddress, usdToCrypto, type CryptoOption } from '@/lib/crypto';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';
import { CryptoIcon } from '@/components/crypto/CryptoIcon';

const ORDERS_KEY = 'em_orders';
const PURCHASED_KEY = 'em_purchased';
const DEPOSITS_KEY = 'em_deposits';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState<'balance' | 'crypto'>('balance');
  const [cryptoStep, setCryptoStep] = useState<1 | 2 | 3>(1);
  const [selected, setSelected] = useState<CryptoOption | null>(null);
  const [txid, setTxid] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const insufficient = user.balance < total;

  const payWithBalance = () => {
    if (insufficient) {
      setError('Insufficient balance. Deposit funds to continue.');
      return;
    }
    const orderId = `ord_${Date.now()}`;
    const order = {
      id: orderId,
      user_id: user.id,
      status: 'completed',
      total,
      payment_method: 'balance',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: items.map((i) => ({
        id: `oi_${Date.now()}_${i.product.id}`,
        order_id: orderId,
        product_id: i.product.id,
        price: i.product.price,
        quantity: i.quantity,
        product: i.product,
      })),
    };
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    const purchased = JSON.parse(localStorage.getItem(PURCHASED_KEY) || '{}');
    if (!purchased[user.id]) purchased[user.id] = [];
    items.forEach((i) => {
      for (let n = 0; n < i.quantity; n++) {
        purchased[user.id].push({ ...i.product, purchased_at: new Date().toISOString(), order_id: orderId });
      }
    });
    localStorage.setItem(PURCHASED_KEY, JSON.stringify(purchased));
    updateBalance(user.balance - total);
    clearCart();
    setDone(true);
  };

  const submitCrypto = (e: FormEvent) => {
    e.preventDefault();
    if (!txid.trim() || !selected) return;
    const orderId = `ord_${Date.now()}`;
    const wallet = getWalletAddress(selected.envKey);
    const cryptoAmount = usdToCrypto(total, selected.rateUsd, selected.symbol);
    const order = {
      id: orderId,
      user_id: user.id,
      status: 'awaiting_payment',
      total,
      payment_method: 'crypto',
      crypto_type: selected.id,
      crypto_amount: cryptoAmount,
      network: selected.network,
      wallet_address: wallet,
      txid: txid.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: items.map((i) => ({
        id: `oi_${Date.now()}_${i.product.id}`,
        order_id: orderId,
        product_id: i.product.id,
        price: i.product.price,
        quantity: i.quantity,
        product: i.product,
      })),
    };
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    const deposits = JSON.parse(localStorage.getItem(DEPOSITS_KEY) || '[]');
    deposits.push({
      id: `dep_${Date.now()}`,
      user_id: user.id,
      amount_usd: total,
      crypto_type: selected.id,
      crypto_amount: cryptoAmount,
      wallet_address: wallet,
      txid: txid.trim(),
      proof_url: null,
      status: 'pending',
      order_id: orderId,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(DEPOSITS_KEY, JSON.stringify(deposits));
    clearCart();
    setDone(true);
  };

  const copyAddress = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  if (items.length === 0 && !done) {
    navigate('/cart');
    return null;
  }

  if (done) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="mx-auto max-w-lg px-4 py-12 text-center space-y-4">
          <Card>
            <p className="text-success font-medium text-lg">
              {method === 'balance' ? 'Order placed' : 'Payment Submitted'}
            </p>
            <p className="text-sm text-muted mt-2">
              {method === 'balance' ? 'Payment completed from your balance.' : 'Waiting for admin approval.'}
            </p>
            <Button className="mt-6" onClick={() => navigate('/orders')}>View orders</Button>
          </Card>
        </main>
      </div>
    );
  }

  const wallet = selected ? getWalletAddress(selected.envKey) : '';
  const cryptoAmount = selected ? usdToCrypto(total, selected.rateUsd, selected.symbol) : 0;

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
        <h1 className="text-xl font-semibold">{method === 'crypto' ? 'Pay with Crypto' : 'Checkout'}</h1>

        <Card>
          <p className="text-sm text-muted mb-2">{items.length} item(s)</p>
          <p className="text-2xl font-semibold text-accent">{formatPrice(total)}</p>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => { setMethod('balance'); setCryptoStep(1); setSelected(null); setError(''); }}
            className={`rounded-lg border px-3 py-3 text-sm font-medium ${
              method === 'balance' ? 'border-accent bg-blue-50 text-accent' : 'border-border bg-white text-muted'
            }`}
          >
            Account Balance
            <span className="block text-xs mt-0.5 opacity-80">{formatPrice(user.balance)}</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('crypto')}
            className={`rounded-lg border px-3 py-3 text-sm font-medium ${
              method === 'crypto' ? 'border-accent bg-blue-50 text-accent' : 'border-border bg-white text-muted'
            }`}
          >
            Pay with Crypto
          </button>
        </div>

        {method === 'balance' && insufficient && (
          <Card className="border border-amber-200 bg-amber-50 space-y-3">
            <p className="text-sm font-medium text-amber-900">Insufficient wallet balance</p>
            <p className="text-xs text-amber-800">
              You need {formatPrice(total)} but only have {formatPrice(user.balance)}.
              Deposit crypto funds to complete this purchase.
            </p>
            <Button className="w-full" onClick={() => navigate('/deposit')}>
              Deposit now
            </Button>
          </Card>
        )}

        {error && !insufficient && <p className="text-sm text-danger">{error}</p>}

        {method === 'balance' ? (
          <Button className="w-full" onClick={payWithBalance} disabled={insufficient}>
            Pay {formatPrice(total)}
          </Button>
        ) : (
          <div className="space-y-4">
            {cryptoStep === 1 && (
              <Card className="space-y-3">
                <p className="text-sm font-medium">Step 1: Choose Crypto</p>
                <div className="grid grid-cols-2 gap-2">
                  {CRYPTO_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setSelected(c); setCryptoStep(2); }}
                      className="rounded-lg border border-border bg-white px-3 py-3 text-left text-sm hover:border-accent/50 transition-colors flex items-center gap-2"
                    >
                      <CryptoIcon option={c} size={32} />
                      <span>
                        <span className="font-semibold text-accent block">{c.symbol}</span>
                        <span className="text-xs text-muted">{c.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {cryptoStep === 2 && selected && (
              <Card className="space-y-4">
                <p className="text-sm font-medium">Step 2: Send to Admin Wallet</p>
                <div className="rounded-lg bg-surface-2 p-3 space-y-1 text-sm">
                  <p><span className="text-muted">Crypto:</span> {selected.name}</p>
                  <p><span className="text-muted">Network:</span> {selected.network}</p>
                  <p>
                    <span className="text-muted">Amount:</span>{' '}
                    <span className="font-semibold text-accent">
                      {formatPrice(total)} USD = {cryptoAmount} {selected.symbol}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Admin Wallet Address</p>
                  <p className="break-all rounded-lg bg-surface-2 px-3 py-2 font-mono text-xs">{wallet}</p>
                  <div className="mt-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => copyAddress(wallet)}>
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="rounded-xl bg-white p-3 border border-border">
                    <QRCodeSVG value={wallet} size={160} />
                  </div>
                </div>
                <p className="text-xs text-warning leading-relaxed">
                  Send the exact amount above to this admin address only.
                  Send on the correct network: {selected.network}.
                  Wrong network = funds will be lost.
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => { setCryptoStep(1); setSelected(null); }}>Back</Button>
                  <Button type="button" className="flex-1" onClick={() => setCryptoStep(3)}>I sent payment</Button>
                </div>
              </Card>
            )}

            {cryptoStep === 3 && selected && (
              <Card className="space-y-4">
                <p className="text-sm font-medium">Step 3: Confirm You Paid</p>
                <p className="text-xs text-muted">{selected.symbol} · {cryptoAmount} · {selected.network}</p>
                <form onSubmit={submitCrypto} className="space-y-3">
                  <Input label="Paste your TXID / Transaction Hash" value={txid} onChange={(e) => setTxid(e.target.value)} required placeholder="Transaction hash" />
                  <Button type="submit" className="w-full">Submit Payment</Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setCryptoStep(2)}>Back</Button>
                </form>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
