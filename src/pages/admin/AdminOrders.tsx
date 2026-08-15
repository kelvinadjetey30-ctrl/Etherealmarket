import { Card } from '@/components/ui/Card';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminOrders() {
  const orders = JSON.parse(localStorage.getItem('em_orders') || '[]');
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Orders</h1>
      {orders.length === 0 ? (
        <Card className="py-8 text-center text-muted">No orders</Card>
      ) : (
        <div className="space-y-3">
          {orders.slice().reverse().map((o: any) => (
            <Card key={o.id}>
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-mono text-sm text-accent-light">{o.id}</p>
                  <p className="text-xs text-muted">{formatDate(o.created_at)}</p>
                  <p className="text-xs text-muted">User: {o.user_id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(o.total)}</p>
                  <p className="text-xs text-muted">{o.status} · {o.payment_method}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
