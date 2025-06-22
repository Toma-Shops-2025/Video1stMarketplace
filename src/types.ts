export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  seller_id: string;
  status: string;
  images?: string[];
  media_urls?: string[];
  video_url?: string | null;
  image_url?: string | null;
  thumbnail_url?: string | null;
  category_slug: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  allow_shipping?: boolean;
  local_pickup_only?: boolean;
  created_at: string;
  type: 'product' | 'rental' | 'digital';
  // Rental specific
  rent?: number;
  deposit?: number;
  utilities_paid?: boolean;
  lease_length?: string;
  pet_policy?: string;
  bedrooms?: number;
  bathrooms?: number;
  application_fee?: boolean;
  photo_urls?: string[];
  // Digital specific
  digital_file_url?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product: Product; // Nested product details
  title: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
  status: 'paid' | 'shipped' | 'delivered' | 'released' | 'cancelled';
  payment_method: string;
  payment_intent_id?: string;
  seller_stripe_account_id?: string;
  created_at: string;
}

export interface Like {
  id: number;
  user_id: string;
  product_id: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  product_id?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
} 