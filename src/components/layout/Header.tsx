import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Wallet, ArrowLeft, Home } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

export function Header() {
  const { user, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const isHome = location.pathname === '/dashboard' || location.pathname === '/marketplace';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-1.5 min-w-0">
          {!isHome && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white hover:bg-surface-2 transition-colors shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4 text-text" />
            </button>
          )}
          <Link
            to="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white hover:bg-surface-2 transition-colors shrink-0"
            aria-label="Home"
          >
            <Home className="h-4 w-4 text-accent" />
          </Link>
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0 min-w-0">
            <Logo size={32} />
            <span className="font-semibold tracking-tight text-text hidden sm:inline truncate">
              ETHEREALMARKET
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <Link
              to="/deposit"
              className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 border border-blue-100 hover:bg-blue-100 transition-colors"
              title="Deposit funds"
            >
              <Wallet className="h-3.5 w-3.5 text-accent" />
              <span className="text-sm font-semibold text-accent">{formatPrice(user.balance ?? 0)}</span>
            </Link>
          )}

          <Link
            to="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white hover:bg-surface-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white hover:bg-surface-2"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </button>
            {accountOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border bg-white py-1 shadow-lg">
                  <Link to="/account" onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2">
                    Account
                  </Link>
                  <Link to="/deposit" onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2">
                    Deposit
                  </Link>
                  <Link to="/orders" onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2">
                    Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2 text-accent">
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
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white sm:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-white px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {[
              { to: '/dashboard', label: 'Marketplace' },
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
