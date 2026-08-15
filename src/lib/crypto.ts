// Public deposit wallet addresses only — never private keys
export const WALLET_ADDRESSES: Record<string, string> = {
  BTC: import.meta.env.VITE_WALLET_BTC || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  'USDT-TRC20': import.meta.env.VITE_WALLET_USDT_TRC20 || 'TXyzExampleTronAddressForDemoOnly123456',
  'USDT-ERC20': import.meta.env.VITE_WALLET_USDT_ERC20 || '0xExampleEthereumAddressForDemoOnly1234567890',
  ETH: import.meta.env.VITE_WALLET_ETH || '0xExampleEthereumAddressForDemoOnly1234567890',
};

// Approximate rates for display (demo only)
export const CRYPTO_RATES: Record<string, number> = {
  BTC: 65000,
  'USDT-TRC20': 1,
  'USDT-ERC20': 1,
  ETH: 3200,
};

export function usdToCrypto(usd: number, type: string): number {
  const rate = CRYPTO_RATES[type] || 1;
  if (type === 'BTC' || type === 'ETH') {
    return Number((usd / rate).toFixed(8));
  }
  return Number(usd.toFixed(2));
}
