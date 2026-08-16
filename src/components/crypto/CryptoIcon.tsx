import type { CryptoOption } from '@/lib/crypto';

/** Simple branded coin badge used as logo for each crypto option */
export function CryptoIcon({ option, size = 28 }: { option: CryptoOption; size?: number }) {
  const letter = option.symbol.slice(0, 1);
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: option.color,
        fontSize: size * 0.4,
      }}
      title={option.name}
    >
      {letter}
    </span>
  );
}
