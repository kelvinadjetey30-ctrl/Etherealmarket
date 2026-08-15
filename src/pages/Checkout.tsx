import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { WALLET_ADDRESSES, usdToCrypto } from '@/lib/crypto';
import { QRCodeSVG } from 'qrcode.react';

const ORDERS_KEY = 'em_orders';
const PURCHASED_KEY = 'em_purchased';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState<'balance' | 'crypto'>('balance');
  const [crypto, setCrypto] = useState('USDT-TRC20');
  const [txid, setTxid] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const payWithBalance = () => {
    if (user.balance < total) {
      setError('Insufficient balance. Please deposit funds.');
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
        purchased[user.id].push({
          ...i.product,
          purchased_at: new Date().toISOString(),
          order_id: orderId,
        });
      }
    });
    localStorage.setItem(PURCHASED_KEY, JSON.stringify(purchased));

    updateBalance(user.balance - total);
    clearCart();
    setDone(true);
  };

  const submitCrypto = (e: FormEvent) => {
    e.preventDefault();
    if (!txid.trim()) return;
    const orderId = `ord_${Date.now()}`;
    const order = {
      id: orderId,
      user_id: user.id,
      status: 'awaiting_payment',
      total,
      payment_method: 'crypto',
      crypto_type: crypto,
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
    clearCart();
    setDone(true);
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
            <p className="text-success font-medium text-lg">Order placed</p>
            <p className="text-sm text-muted mt-2">
              {method === 'balance'
                ? 'Payment completed from your balance.'
                : 'Awaiting admin verification of your crypto payment.'}
            </p>
            <Button className="mt-6" onClick={() => navigate('/orders')}>
              View orders
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const cryptoAmount = usdToCrypto(total, crypto);
  const wallet = WALLET_ADDRESSES[crypto] || '';

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
        <h1 className="text-xl font-semibold">Checkout</h1>

        <Card>
          <p className="text-sm text-muted mb-2">{items.length} item(s)</p>
          <p className="text-2xl font-semibold text-accent-light">{formatPrice(total)}</p>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMethod('balance')}
            className={`rounded-lg border px-3 py-3 text-sm font-medium ${
              method === 'balance'
                ? 'border-accent bg-accent/15 text-accent-light'
                : 'border-border bg-surface text-muted'
            }`}
          >
            Account Balance
            <span className="block text-xs mt-0.5 opacity-80">{formatPrice(user.balance)}</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('crypto')}
            className={`rounded-lg border px-3 py-3 text-sm font-medium ${
              method === 'crypto'
                ? 'border-accent bg-accent/15 text-accent-light'
                : 'border-border bg-surface text-muted'
            }`}
          >
            Manual Crypto
          </button>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        {method === 'balance' ? (
          <Button className="w-full" onClick={payWithBalance}>
            Pay {formatPrice(total)}
          </Button>
        ) : (
          <Card className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(['BTC', 'USDT-TRC20', 'USDT-ERC20', 'ETH'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCrypto(c)}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium ${
                    crypto === c
                      ? 'border-accent bg-accent/15 text-accent-light'
                      : 'border-border bg-surface-2 text-muted'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{cryptoAmount} {crypto.split('-')[0]}</p>
              <p className="text-xs text-muted">≈ {formatPrice(total)}</p>
            </div>
            <div className="flex justify-center">
              <div className="rounded-xl bg-white p-3">
                <QRCodeSVG value={wallet} size={140} />
              </div>
            </div>
            <p className="break-all rounded-lg bg-surface-2 px-3 py-2 font-mono text-xs">{wallet}</p>
            <form onSubmit={submitCrypto} className="space-y-3">
              <Input
                label="TXID"
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
                required
                placeholder="Paste transaction ID"
              />
              <Button type="submit" className="w-full">
                Submit payment
              </Button>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
}
