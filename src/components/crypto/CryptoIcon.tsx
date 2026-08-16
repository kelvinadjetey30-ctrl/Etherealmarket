import type { CryptoOption } from '@/lib/crypto';

const COLORS: Record<string, string> = {
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

/** Branded coin badge used as logo for each crypto option */
export function CryptoIcon(props: Props) {
  const size = props.size ?? 28;
  const symbol = props.option?.symbol ?? props.symbol ?? '?';
  const color = props.option?.color ?? COLORS[symbol] ?? '#2563eb';
  const title = props.option?.name ?? symbol;
  const letter = symbol.slice(0, 1);

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
      {letter}
    </span>
  );
}
