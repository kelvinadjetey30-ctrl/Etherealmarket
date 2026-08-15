import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8 space-y-4">
        <h1 className="text-xl font-semibold">Account</h1>
        <Card className="space-y-3">
          <div>
            <p className="text-xs text-muted">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Balance</p>
            <p className="font-medium text-accent-light">{formatPrice(user.balance)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Member since</p>
            <p className="font-medium">{formatDate(user.created_at)}</p>
          </div>
        </Card>
        <Button
          variant="danger"
          className="w-full"
          onClick={async () => {
            await signOut();
            navigate('/login');
          }}
        >
          Sign out
        </Button>
      </main>
    </div>
  );
}
