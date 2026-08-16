import { Link } from 'react-router-dom';
import { Wallet, CreditCard, Home, LifeBuoy } from 'lucide-react';

const shortcuts = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/deposit', label: 'Deposit', icon: Wallet },
  { to: '/my-cards', label: 'My Cards', icon: CreditCard },
  { to: '/support', label: 'Support', icon: LifeBuoy },
];

export function DashboardShortcuts() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {shortcuts.map(({ to, label, icon: Icon }) => (
        <Link
          key={to + label}
          to={to}
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 shadow-sm hover:border-accent/50 hover:bg-blue-50/50 transition-all group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-accent group-hover:bg-blue-100 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-muted group-hover:text-text">{label}</span>
        </Link>
      ))}
    </div>
  );
}
