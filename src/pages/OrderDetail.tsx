import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatDate } from '@/lib/utils';

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const all = JSON.parse(localStorage.getItem('em_orders') || '[]');
  const order = all.find((o: { id: string; user_id: string }) => o.id === id && o.user_id === user?.id);

  if (!order) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="mx-auto max-w-lg px-4 py-12 text-center">
          <p className="text-muted">Order not found</p>
          <Link to="/orders"><Button className="mt-4">Back</Button></Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Order</h1>
          <Link to="/orders"><Button variant="ghost" size="sm">Back</Button></Link>
        </div>
        <Card className="space-y-2">
          <p className="font-mono text-sm text-accent-light">{order.id}</p>
          <p className="text-sm text-muted">{formatDate(order.created_at)}</p>
          <p className="text-sm">Status: <span className="font-medium">{order.status}</span></p>
          <p className="text-sm">Payment: {order.payment_method}</p>
          <p className="text-lg font-semibold text-accent-light">{formatPrice(order.total)}</p>
        </Card>
        <div className="space-y-2">
          {(order.items || []).map((item: {
            id: string;
            price: number;
            quantity: number;
            product?: { bin: string; country: string; brand: string; card_level: string };
          }) => (
            <Card key={item.id}>
              <p className="font-mono font-medium text-accent-light">{item.product?.bin}</p>
              <p className="text-xs text-muted">
                {item.product?.country} · {item.product?.brand} · {item.product?.card_level}
              </p>
              <p className="text-sm mt-1">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
