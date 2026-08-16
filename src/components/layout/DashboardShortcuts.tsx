import { Link } from 'react-router-dom';
import { Wallet, CreditCard, LifeBuoy } from 'lucide-react';

const shortcuts = [
  { to: '/deposit', label: 'Deposit', icon: Wallet },
  { to: '/my-cards', label: 'My Cards', icon: CreditCard },
  { to: '/support', label: 'Support', icon: LifeBuoy },
];

export function DashboardShortcuts() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {shortcuts.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 shadow-sm hover:border-accent/50 hover:bg-blue-50/50 transition-colors group"
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
