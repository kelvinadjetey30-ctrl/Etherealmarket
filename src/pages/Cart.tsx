import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, total, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold">Cart</h1>

        {items.length === 0 ? (
          <Card className="text-center py-12 space-y-4">
            <p className="text-muted">Your cart is empty</p>
            <Link to="/dashboard">
              <Button>Browse marketplace</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map(({ product, quantity }) => (
              <Card key={product.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono font-semibold text-accent-light">{product.bin}</p>
                  <p className="text-xs text-muted">
                    {product.country} · {product.brand} · {product.card_level}
                  </p>
                  <p className="mt-1 text-sm">
                    {formatPrice(product.price)} × {quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}

            <Card className="flex items-center justify-between">
              <span className="font-medium">Total</span>
              <span className="text-lg font-semibold text-accent-light">{formatPrice(total)}</span>
            </Card>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={clearCart}>
                Clear
              </Button>
              <Link to="/checkout" className="flex-1">
                <Button className="w-full">Checkout</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
