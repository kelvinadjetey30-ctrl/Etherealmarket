import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Deposit } from '@/types';

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>(() =>
    JSON.parse(localStorage.getItem('em_deposits') || '[]')
  );

  const updateStatus = (id: string, status: 'approved' | 'rejected') => {
    const next = deposits.map((d) => (d.id === id ? { ...d, status } : d));
    setDeposits(next);
    localStorage.setItem('em_deposits', JSON.stringify(next));

    if (status === 'approved') {
      const dep = deposits.find((d) => d.id === id);
      if (!dep) return;
      const users = JSON.parse(localStorage.getItem('em_users') || '{}');
      const entry = users[dep.user_id];
      if (entry) {
        entry.profile.balance = (entry.profile.balance || 0) + dep.amount_usd;
        users[dep.user_id] = entry;
        localStorage.setItem('em_users', JSON.stringify(users));
      }
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Deposits</h1>
      {deposits.length === 0 ? (
        <Card className="py-8 text-center text-muted">No deposit requests</Card>
      ) : (
        <div className="space-y-3">
          {deposits.slice().reverse().map((d) => (
            <Card key={d.id} className="space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm text-accent-light">{d.id}</p>
                  <p className="text-xs text-muted">{formatDate(d.created_at)}</p>
                  <p className="text-sm mt-1">{formatPrice(d.amount_usd)} · {d.crypto_amount} {d.crypto_type}</p>
                  <p className="text-xs text-muted break-all mt-1">TXID: {d.txid || '—'}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                  d.status === 'approved' ? 'bg-success/15 text-success' :
                  d.status === 'rejected' ? 'bg-danger/15 text-danger' : 'bg-warning/15 text-warning'
                }`}>{d.status}</span>
              </div>
              {d.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateStatus(d.id, 'approved')}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => updateStatus(d.id, 'rejected')}>Reject</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
