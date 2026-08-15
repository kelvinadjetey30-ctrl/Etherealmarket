import { useState, FormEvent } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';

const SUPPORT_KEY = 'em_support';

export default function Support() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState(() => {
    const all = JSON.parse(localStorage.getItem(SUPPORT_KEY) || '[]');
    return user ? all.filter((t: { user_id: string }) => t.user_id === user.id) : [];
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !subject.trim() || !message.trim()) return;
    const ticket = {
      id: `tkt_${Date.now()}`,
      user_id: user.id,
      subject: subject.trim(),
      message: message.trim(),
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const all = JSON.parse(localStorage.getItem(SUPPORT_KEY) || '[]');
    all.push(ticket);
    localStorage.setItem(SUPPORT_KEY, JSON.stringify(all));
    setTickets([ticket, ...tickets]);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <h1 className="text-xl font-semibold">Support</h1>

        <Card>
          <form onSubmit={submit} className="space-y-3">
            <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:border-accent-light focus:outline-none"
              />
            </div>
            <Button type="submit">Submit request</Button>
          </form>
        </Card>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted">Your requests</h2>
          {tickets.length === 0 ? (
            <p className="text-sm text-muted">No support requests</p>
          ) : (
            tickets.map((t: { id: string; subject: string; message: string; status: string; created_at: string }) => (
              <Card key={t.id}>
                <div className="flex justify-between gap-2">
                  <p className="font-medium">{t.subject}</p>
                  <span className="text-xs text-muted uppercase">{t.status}</span>
                </div>
                <p className="text-sm text-muted mt-1">{t.message}</p>
                <p className="text-xs text-muted mt-2">{formatDate(t.created_at)}</p>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
