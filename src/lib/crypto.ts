// Public deposit wallet addresses only — never private keys
export type CryptoOption = {
  id: string;
  name: string;
  symbol: string;
  network: string;
  envKey: string;
  rateUsd: number;
};

export const CRYPTO_OPTIONS: CryptoOption[] = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', envKey: 'VITE_WALLET_BTC', rateUsd: 65000 },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', network: 'Ethereum (ERC-20)', envKey: 'VITE_WALLET_ETH', rateUsd: 3200 },
  { id: 'SOL', name: 'Solana', symbol: 'SOL', network: 'Solana', envKey: 'VITE_WALLET_SOL', rateUsd: 150 },
  { id: 'LTC', name: 'Litecoin', symbol: 'LTC', network: 'Litecoin', envKey: 'VITE_WALLET_LTC', rateUsd: 85 },
  { id: 'TRX', name: 'Tron', symbol: 'TRX', network: 'TRON', envKey: 'VITE_WALLET_TRX', rateUsd: 0.12 },
  { id: 'USDT', name: 'Tether', symbol: 'USDT', network: 'TRC20 (Tron)', envKey: 'VITE_WALLET_USDT_TRC20', rateUsd: 1 },
];

const DEFAULT_WALLETS: Record<string, string> = {
  VITE_WALLET_BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  VITE_WALLET_ETH: '0xExampleEthereumAddressForDemoOnly1234567890',
  VITE_WALLET_SOL: 'SoLExampleAddressForDemoOnly123456789ABCDEF',
  VITE_WALLET_LTC: 'ltc1qexampleaddressfordemonly123456',
  VITE_WALLET_TRX: 'TXyzExampleTronAddressForDemoOnly123456',
  VITE_WALLET_USDT_TRC20: 'TXyzExampleTronAddressForDemoOnly123456',
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
