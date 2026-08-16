import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatDate } from '@/lib/utils';

export default function Orders() {
  const { user } = useAuth();
  const all = JSON.parse(localStorage.getItem('em_orders') || '[]');
  const orders = user ? all.filter((o: { user_id: string }) => o.user_id === user.id) : [];

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold">Orders</h1>
        {orders.length === 0 ? (
          <Card className="py-12 text-center text-muted">No orders yet</Card>
        ) : (
          <div className="space-y-3">
            {orders
              .slice()
              .reverse()
              .map((o: {
                id: string;
                total: number;
                status: string;
                payment_method: string;
                created_at: string;
                items?: { product?: { bin: string } }[];
              }) => (
                <Link key={o.id} to={`/orders/${o.id}`}>
                  <Card className="hover:border-accent/40 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm text-accent-light">{o.id}</p>
                        <p className="text-xs text-muted mt-0.5">{formatDate(o.created_at)}</p>
                        <p className="text-xs text-muted mt-1">
                          {o.items?.length || 0} item(s) · {o.payment_method}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(o.total)}</p>
                        <span
                          className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                            o.status === 'completed'
                              ? 'bg-success/15 text-success'
                              : o.status === 'awaiting_payment'
                              ? 'bg-warning/15 text-warning'
                              : 'bg-muted/15 text-muted'
                          }`}
                        >
                          {o.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
