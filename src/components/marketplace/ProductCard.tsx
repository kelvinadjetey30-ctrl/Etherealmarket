import type { Product } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap } from 'lucide-react';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleBuy = () => {
    addItem(product);
    navigate('/checkout');
  };

  return (
    <Card className="flex flex-col gap-3 hover:border-accent/40 transition-all duration-200">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-lg font-semibold tracking-wide text-accent-light">{product.bin}</p>
          <p className="text-xs text-muted mt-0.5">{product.country} · {product.issuer}</p>
        </div>
        <span className="rounded-md bg-accent/15 px-2 py-0.5 text-sm font-semibold text-accent-light">
          {formatPrice(product.price)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <div>
          <span className="text-muted">Brand</span>
          <p className="font-medium truncate">{product.brand}</p>
        </div>
        <div>
          <span className="text-muted">Level</span>
          <p className="font-medium truncate">{product.card_level}</p>
        </div>
        <div className="col-span-2">
          <span className="text-muted">Type</span>
          <p className="font-medium truncate">{product.card_type}</p>
        </div>
      </div>

      <div className="mt-auto flex gap-2 pt-1">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => addItem(product)}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Cart
        </Button>
        <Button size="sm" className="flex-1" onClick={handleBuy}>
          <Zap className="h-3.5 w-3.5" />
          Buy
        </Button>
      </div>
    </Card>
  );
}
