import { Card } from '@/components/ui/Card';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminUsers() {
  const users = Object.values(JSON.parse(localStorage.getItem('em_users') || '{}')) as any[];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Users</h1>
      {users.length === 0 ? (
        <Card className="py-8 text-center text-muted">No users</Card>
      ) : (
        <div className="space-y-3">
          {users.map(({ profile: u }) => (
            <Card key={u.id}>
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-medium">{u.email}</p>
                  <p className="text-xs text-muted capitalize">{u.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-accent-light">{formatPrice(u.balance)}</p>
                  <p className="text-xs text-muted">{formatDate(u.created_at)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
