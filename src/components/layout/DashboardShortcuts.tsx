import { Link } from 'react-router-dom';
import { Wallet, CreditCard, FileText, LifeBuoy } from 'lucide-react';

const shortcuts = [
  { to: '/deposit', label: 'Deposit', icon: Wallet },
  { to: '/my-cards', label: 'My Cards', icon: CreditCard },
  { to: '/orders', label: 'Shop Logs', icon: FileText },
  { to: '/support', label: 'Support', icon: LifeBuoy },
];

export function DashboardShortcuts() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {shortcuts.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 hover:border-accent/50 hover:bg-surface-2 transition-all group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent-light group-hover:bg-accent/20 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-muted group-hover:text-text">{label}</span>
        </Link>
      ))}
    </div>
  );
}
