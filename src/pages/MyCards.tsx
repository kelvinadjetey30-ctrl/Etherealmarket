import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Product } from '@/types';

interface Purchased extends Product {
  purchased_at: string;
  order_id: string;
}

export default function MyCards() {
  const { user } = useAuth();
  const all: Record<string, Purchased[]> = JSON.parse(localStorage.getItem('em_purchased') || '{}');
  const items = user ? all[user.id] || [] : [];

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold">My Cards</h1>
        {items.length === 0 ? (
          <Card className="py-12 text-center text-muted">No purchases yet</Card>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <Card key={`${item.id}-${idx}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-mono font-semibold text-accent-light">{item.bin}</p>
                  <p className="text-xs text-muted">
                    {item.country} · {item.brand} · {item.card_level} · {item.issuer}
                  </p>
                  <p className="text-xs text-muted mt-1">{item.card_type}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{formatPrice(item.price)}</p>
                  <p className="text-xs text-muted">{formatDate(item.purchased_at)}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
