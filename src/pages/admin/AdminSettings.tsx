import { Card } from '@/components/ui/Card';

export default function AdminSettings() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <Card className="space-y-3 text-sm">
        <p className="text-muted">
          Connect Supabase by setting <code className="text-accent-light">VITE_SUPABASE_URL</code> and{' '}
          <code className="text-accent-light">VITE_SUPABASE_ANON_KEY</code> in your environment.
        </p>
        <p className="text-muted">
          Wallet addresses are configured via <code className="text-accent-light">VITE_WALLET_*</code> variables.
          Never store private keys in the frontend.
        </p>
        <p className="text-muted">
          To create the first admin in Supabase: sign up a user, then set{' '}
          <code className="text-accent-light">role = 'admin'</code> on their profiles row in the dashboard.
        </p>
        <p className="text-muted">
          Local demo admin: <code className="text-accent-light">admin@etherealmarket.demo</code> / <code className="text-accent-light">AdminDemo123!</code>
        </p>
      </Card>
    </div>
  );
}
