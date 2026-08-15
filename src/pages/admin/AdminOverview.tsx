import { CATALOG } from '@/data/catalog';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

export default function AdminOverview() {
  const orders = JSON.parse(localStorage.getItem('em_orders') || '[]');
  const deposits = JSON.parse(localStorage.getItem('em_deposits') || '[]');
  const users = JSON.parse(localStorage.getItem('em_users') || '{}');
  const pendingDeposits = deposits.filter((d: { status: string }) => d.status === 'pending').length;
  const revenue = orders
    .filter((o: { status: string }) => o.status === 'completed')
    .reduce((s: number, o: { total: number }) => s + o.total, 0);

  const stats = [
    { label: 'Products', value: CATALOG.length },
    { label: 'Orders', value: orders.length },
    { label: 'Users', value: Object.keys(users).length },
    { label: 'Pending deposits', value: pendingDeposits },
    { label: 'Completed revenue', value: formatPrice(revenue) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Overview</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-xs text-muted">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold text-accent-light">{s.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
