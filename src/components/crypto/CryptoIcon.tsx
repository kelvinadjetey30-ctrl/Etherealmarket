import { useState } from 'react';
import type { CryptoOption } from '@/lib/crypto';

/** Real coin logo images (public CDN). */
const LOGO_URLS: Record<string, string> = {
  BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  LTC: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
  TRX: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  DOGE: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  XRP: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  BNB: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  ADA: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
};

const FALLBACK_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#14F195',
  LTC: '#345D9D',
  TRX: '#FF0013',
  USDT: '#26A17B',
  DOGE: '#C2A633',
  XRP: '#23292F',
  BNB: '#F3BA2F',
  ADA: '#0033AD',
};

type Props =
  | { option: CryptoOption; symbol?: never; size?: number }
  | { symbol: string; option?: never; size?: number };

/** Real crypto coin logo (image). Falls back to colored letter if image fails. */
export function CryptoIcon(props: Props) {
  const size = props.size ?? 28;
  const symbol = (props.option?.symbol ?? props.symbol ?? '?').toUpperCase();
  const title = props.option?.name ?? symbol;
  const src = LOGO_URLS[symbol];
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={title}
        title={title}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0 bg-white"
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
    );
  }

  const color = props.option?.color ?? FALLBACK_COLORS[symbol] ?? '#2563eb';
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0 shadow-sm"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.4,
      }}
      title={title}
    >
      {symbol.slice(0, 1)}
    </span>
  );
}
