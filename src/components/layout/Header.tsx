import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export function Header() {
  const { user, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4">
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">EM</span>
          </div>
          <span className="font-semibold tracking-tight text-text hidden sm:inline">ETHEREALMARKET</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <div className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1.5 border border-border">
              <Wallet className="h-3.5 w-3.5 text-accent-light" />
              <span className="text-sm font-medium text-accent-light">{formatPrice(user.balance)}</span>
            </div>
          )}

          <Link
            to="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface hover:bg-surface-2 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white px-1">
                {count}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface hover:bg-surface-2 transition-colors"
            >
              <User className="h-4 w-4" />
            </button>
            {accountOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-surface p-1 shadow-xl">
                  <div className="px-3 py-2 text-xs text-muted truncate border-b border-border mb-1">
                    {user?.email}
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2"
                  >
                    Account
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2 text-accent-light"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-surface-2"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface sm:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-surface px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/marketplace', label: 'Marketplace' },
              { to: '/deposit', label: 'Deposit' },
              { to: '/my-cards', label: 'My Cards' },
              { to: '/orders', label: 'Orders' },
              { to: '/support', label: 'Support' },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm hover:bg-surface-2"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
