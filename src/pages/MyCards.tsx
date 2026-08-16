import { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatDate } from '@/lib/utils';
import { CATALOG } from '@/data/catalog';
import type { Product } from '@/types';

interface Purchased extends Product {
  purchased_at: string;
  order_id: string;
}

const DEMO_KEY = 'em_purchased';

function ensureDemoPurchases(userId: string): Purchased[] {
  const all: Record<string, Purchased[]> = JSON.parse(localStorage.getItem(DEMO_KEY) || '{}');
  if (all[userId]?.length) return all[userId];

  // Seed 1300 simulated owned cards for demo / school presentation
  const seeded: Purchased[] = CATALOG.slice(0, 1300).map((p, i) => ({
    ...p,
    purchased_at: new Date(Date.UTC(2026, 0, 1 + (i % 28), 10, i % 60)).toISOString(),
    order_id: `ord_demo_${String(i + 1).padStart(4, '0')}`,
  }));
  all[userId] = seeded;
  localStorage.setItem(DEMO_KEY, JSON.stringify(all));
  return seeded;
}

export default function MyCards() {
  const { user } = useAuth();
  const items = useMemo(() => {
    if (!user) return [];
    return ensureDemoPurchases(user.id);
  }, [user]);

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">My Cards</h1>
            <p className="text-sm text-muted">{items.length} cards in your inventory</p>
          </div>
        </div>

        {items.length === 0 ? (
          <Card className="py-12 text-center text-muted bg-white border border-border">No purchases yet</Card>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <Card
                key={`${item.id}-${idx}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-border shadow-sm"
              >
                <div>
                  <p className="font-mono font-semibold text-accent">{item.bin}</p>
                  <p className="text-xs text-muted">
                    {item.country} · {item.brand} · {item.card_level} · {item.issuer}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {item.card_type} · ZIP {item.zip_code}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium text-text">{formatPrice(item.price)}</p>
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
