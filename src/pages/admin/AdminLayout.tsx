import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Wallet,
  Settings,
  FileText,
  ArrowLeft,
  Tags,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const nav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/cards', label: 'Cards', icon: CreditCard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/deposits', label: 'Deposits', icon: Wallet },
  { to: '/admin/settings/wallets', label: 'Wallets', icon: Wallet },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/taxonomies', label: 'Taxonomies', icon: Tags },
  { to: '/admin/audit-log', label: 'Audit Log', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      <aside className="border-b md:border-b-0 md:border-r border-border bg-white md:w-56 shrink-0 shadow-sm">
        <div className="flex items-center justify-between p-4 md:block">
          <div>
            <p className="font-semibold text-sm text-text">Admin</p>
            <p className="text-xs text-muted truncate">{user?.email}</p>
          </div>
          <Link
            to="/dashboard"
            className="md:mt-3 hidden md:flex items-center gap-1 text-xs text-accent hover:underline"
          >
            <ArrowLeft className="h-3 w-3" /> Storefront
          </Link>
        </div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto px-2 pb-3 md:pb-4">
          {nav.map(({ to, label, icon: Icon, end }) => {
            const active = end ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  active ? 'bg-blue-50 text-accent font-medium' : 'text-muted hover:bg-surface-2 hover:text-text'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-6 overflow-auto bg-surface">
        <Outlet />
      </main>
    </div>
  );
}
