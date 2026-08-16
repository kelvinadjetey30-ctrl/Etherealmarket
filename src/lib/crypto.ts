// Public deposit wallet addresses only — never private keys
export type CryptoOption = {
  id: string;
  name: string;
  symbol: string;
  network: string;
  envKey: string;
  rateUsd: number;
  color: string;
};

export const CRYPTO_OPTIONS: CryptoOption[] = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', envKey: 'VITE_WALLET_BTC', rateUsd: 65000, color: '#F7931A' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', network: 'Ethereum (ERC-20)', envKey: 'VITE_WALLET_ETH', rateUsd: 3200, color: '#627EEA' },
  { id: 'SOL', name: 'Solana', symbol: 'SOL', network: 'Solana', envKey: 'VITE_WALLET_SOL', rateUsd: 150, color: '#14F195' },
  { id: 'LTC', name: 'Litecoin', symbol: 'LTC', network: 'Litecoin', envKey: 'VITE_WALLET_LTC', rateUsd: 85, color: '#345D9D' },
  { id: 'TRX', name: 'Tron', symbol: 'TRX', network: 'TRON', envKey: 'VITE_WALLET_TRX', rateUsd: 0.12, color: '#FF0013' },
  { id: 'USDT', name: 'Tether', symbol: 'USDT', network: 'TRC20 (Tron)', envKey: 'VITE_WALLET_USDT_TRC20', rateUsd: 1, color: '#26A17B' },
];

// Exact admin wallets provided for this project
const DEFAULT_WALLETS: Record<string, string> = {
  VITE_WALLET_BTC: 'bc1qy0uthkh50rdajnzlq8cqfgyea9fx3twtpcycqh',
  VITE_WALLET_ETH: '0x9825ce02321860d248DDab72BC44A30810634E1E',
  VITE_WALLET_SOL: '9buLs73w2UqCWCwUPcqn2QitkZ2gJU5sUTzmkkNPcCyr',
  VITE_WALLET_LTC: 'ltc1qusj23jzqda7tq0lk578hl9xhz4hktrgq7pnyvq',
  VITE_WALLET_TRX: 'TRdhtFumJDc68QipY5YdWVXrPngjzEFN9V',
  VITE_WALLET_USDT_TRC20: 'TRdhtFumJDc68QipY5YdWVXrPngjzEFN9V',
};

const WALLETS_KEY = 'em_admin_wallets';

export function getWalletAddress(envKey: string): string {
  try {
    const stored = JSON.parse(localStorage.getItem(WALLETS_KEY) || '{}');
    if (stored[envKey]) return stored[envKey];
  } catch { /* ignore */ }
  const fromEnv = (import.meta.env as Record<string, string | undefined>)[envKey];
  return fromEnv || DEFAULT_WALLETS[envKey] || '';
}

export function usdToCrypto(usd: number, rateUsd: number, symbol: string): number {
  if (rateUsd <= 0) return 0;
  const amount = usd / rateUsd;
  if (symbol === 'BTC' || symbol === 'ETH') return Number(amount.toFixed(8));
  if (symbol === 'SOL' || symbol === 'LTC') return Number(amount.toFixed(6));
  if (symbol === 'TRX') return Number(amount.toFixed(2));
  return Number(amount.toFixed(2));
}
