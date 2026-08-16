export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  balance: number;
  created_at: string;
}

export interface Product {
  id: string;
  bin: string;
  country: string;
  brand: string;
  card_type: string;
  card_level: string;
  issuer: string;
  price: number;
  zip_code: string;
  stock: number;
  name: string;
  category: string;
  description: string;
  image: string;
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'awaiting_payment' | 'paid' | 'completed' | 'cancelled' | 'refunded';
  total: number;
  payment_method: 'balance' | 'crypto';
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  price: number;
  quantity: number;
  product?: Product;
}

export interface Deposit {
  id: string;
  user_id: string;
  amount_usd: number;
  crypto_type: string;
  crypto_amount: number;
  wallet_address: string;
  txid: string | null;
  proof_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}

export interface WalletEntry {
  id: string;
  coin: string;
  network: string;
  address: string;
  icon: string;
}

export interface FilterState {
  country: string[];
  brand: string[];
  cardType: string[];
  cardLevel: string[];
  issuer: string[];
  priceMin: number;
  priceMax: number;
  search: string;
}
