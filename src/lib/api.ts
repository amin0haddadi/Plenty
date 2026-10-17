import type { Product } from '@/types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';

export type ApiCategory = {
  id: string;
  numeric_id: number;
  name: string;
  slug: string;
  description?: string;
  image: string;
  icon?: string;
};

export type ApiProduct = {
  id: string | number;
  numeric_id?: number;
  name: string;
  slug?: string;
  unit?: string;
  price?: number;
  image?: string;
  inStock?: boolean;
  in_stock?: boolean;
  category?: string;
  category_name?: string;
  description?: string;
  photos?: Array<{ id: number; url: string }>;
};

function normalizeProduct(p: ApiProduct): Product {
  const id = String(p.slug || p.id || p.numeric_id || '');
  const image =
    p.image ||
    p.photos?.[0]?.url ||
    (id === 'lettuce'
      ? '/products/lettuce.jpg'
      : id === 'tomato'
        ? '/products/tomato.jpg'
        : id === 'orange' || id === 'banana'
          ? '/products/orange.jpg'
          : id === 'watermelon'
            ? '/products/Watermelon.jpg'
            : '/products/apple.jpg');

  return {
    id,
    name: p.name,
    unit: p.unit || 'کیلو',
    price: Number(p.price) || 0,
    image,
    inStock: Boolean(p.inStock ?? p.in_stock),
    category: p.category || '',
    description: p.description || '',
  };
}

type FetchOptions = RequestInit & { next?: { revalidate?: number } };

export async function fetchProductsFromApi(params?: {
  category?: string;
  search?: string;
}): Promise<Product[]> {
  const url = new URL(`${API_BASE_URL}/products`);
  if (params?.category && params.category !== 'picked') {
    url.searchParams.set('filter[category.slug]', params.category);
  }
  if (params?.search) {
    url.searchParams.set('filter[name]', params.search);
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 30 },
  } as FetchOptions);

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }

  const json = await res.json();
  const items: ApiProduct[] = Array.isArray(json) ? json : json.data || [];
  return items.map(normalizeProduct);
}

export async function fetchProductFromApi(id: string): Promise<Product | null> {
  const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 30 },
  } as FetchOptions);

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.statusText}`);

  const json = await res.json();
  const item: ApiProduct = json.data || json;
  return normalizeProduct(item);
}

export async function fetchCategoriesFromApi(): Promise<ApiCategory[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  } as FetchOptions);

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.statusText}`);
  }

  const json = await res.json();
  const items: any[] = Array.isArray(json) ? json : json.data || [];
  return items.map(cat => ({
    id: cat.slug || String(cat.id),
    numeric_id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    image: cat.image || cat.icon || '/products/apple.jpg',
    icon: cat.icon,
  }));
}

// Token and Header Management
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('plenty_token');
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem('plenty_token', token);
  } else {
    window.localStorage.removeItem('plenty_token');
  }
}

export function getGuestToken(): string {
  if (typeof window === 'undefined') return '';
  let token = window.localStorage.getItem('plenty_guest_token');
  if (!token) {
    token =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'guest_' + Math.random().toString(36).substring(2);
    window.localStorage.setItem('plenty_guest_token', token);
  }
  return token;
}

export function getClientHeaders(customHeaders?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const guestToken = getGuestToken();
  if (guestToken) {
    headers['X-Guest-Token'] = guestToken;
  }
  return { ...headers, ...(customHeaders as Record<string, string>) };
}

// Cart API
export type ApiCartItem = {
  id: number;
  product_id?: string | number;
  productId?: string | number;
  numeric_product_id?: number;
  quantity: number;
  qty?: number;
  price: number | string;
  subtotal: number | string;
  product?: ApiProduct;
};

export type ApiCart = {
  id: number;
  guest_token?: string;
  items: ApiCartItem[];
  subtotal: number;
  discount: number | string;
  total: number;
  items_count: number;
};

export async function fetchCartApi(): Promise<ApiCart | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getClientHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.warn('Failed to fetch cart from API:', err);
    return null;
  }
}

export async function addToCartApi(
  productId: string | number,
  quantity = 1,
): Promise<ApiCart | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: getClientHeaders(),
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    });
    if (!res.ok) {
      console.warn('Failed to add item to cart:', res.status, await res.text());
      return null;
    }
    const json = await res.json();
    return json.cart || json.data || json;
  } catch (err) {
    console.warn('Error adding to cart API:', err);
    return null;
  }
}

export async function updateCartItemApi(
  productIdOrItemId: string | number,
  quantity: number,
): Promise<ApiCart | null> {
  try {
    if (quantity <= 0) {
      return removeCartItemApi(productIdOrItemId);
    }
    const res = await fetch(
      `${API_BASE_URL}/cart/items/${encodeURIComponent(productIdOrItemId)}`,
      {
        method: 'PUT',
        headers: getClientHeaders(),
        body: JSON.stringify({ quantity }),
      },
    );
    if (!res.ok) {
      console.warn('Failed to update cart item:', res.status, await res.text());
      return null;
    }
    const json = await res.json();
    return json.cart || json.data || json;
  } catch (err) {
    console.warn('Error updating cart item API:', err);
    return null;
  }
}

export async function removeCartItemApi(
  productIdOrItemId: string | number,
): Promise<ApiCart | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/cart/items/${encodeURIComponent(productIdOrItemId)}`,
      {
        method: 'DELETE',
        headers: getClientHeaders(),
      },
    );
    if (!res.ok) {
      console.warn('Failed to delete cart item:', res.status, await res.text());
      return null;
    }
    const json = await res.json();
    return json.cart || json.data || json;
  } catch (err) {
    console.warn('Error removing cart item API:', err);
    return null;
  }
}

export async function clearCartApi(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getClientHeaders(),
    });
    return res.ok;
  } catch (err) {
    console.warn('Error clearing cart API:', err);
    return false;
  }
}

// Address API
import type { Address } from '@/types';

export type ApiAddress = {
  id: number | string;
  title?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address_line_1?: string;
  address_line_2?: string;
  line?: string;
  plaque?: string;
  unit?: string;
  city?: string | { id: number; name: string };
  city_name?: string;
  city_id?: number;
  postal_code?: string;
  is_default?: boolean;
  isDefault?: boolean;
};

export function normalizeAddress(item: ApiAddress): Address {
  const plaque =
    item.plaque ||
    (item.address_line_2 &&
      item.address_line_2.match(/پلاک\s*([^\s،]+)/)?.[1]) ||
    '';
  const unit =
    item.unit ||
    (item.address_line_2 &&
      item.address_line_2.match(/واحد\s*([^\s،]+)/)?.[1]) ||
    '';
  const cityName =
    item.city_name ||
    (typeof item.city === 'object' && item.city ? item.city.name : item.city) ||
    'ابهر';

  return {
    id: String(item.id),
    title: item.title || 'خانه',
    city: cityName,
    line: item.line || item.address_line_1 || '',
    plaque: String(plaque),
    unit: String(unit),
    phone: item.phone || '',
    isDefault: Boolean(item.isDefault ?? item.is_default),
  };
}

export async function fetchAddressesApi(): Promise<Address[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'GET',
      headers: getClientHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    const list: ApiAddress[] = json.data || (Array.isArray(json) ? json : []);
    return list.map(normalizeAddress);
  } catch (err) {
    console.warn('Error fetching addresses from API:', err);
    return [];
  }
}

export async function createAddressApi(
  address: Omit<Address, 'id'> & { id?: string },
): Promise<Address | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: getClientHeaders(),
      body: JSON.stringify({
        title: address.title,
        address_line_1: address.line,
        line: address.line,
        address_line_2:
          [
            address.plaque ? `پلاک ${address.plaque}` : '',
            address.unit ? `واحد ${address.unit}` : '',
          ]
            .filter(Boolean)
            .join('، ') || undefined,
        plaque: address.plaque,
        unit: address.unit,
        city: address.city,
        city_id: 1,
        postal_code: '1111111111',
        phone: address.phone,
        is_default: Boolean(address.isDefault),
        isDefault: Boolean(address.isDefault),
      }),
    });
    if (!res.ok) {
      console.warn('Failed to create address API:', res.status, await res.text());
      return null;
    }
    const json = await res.json();
    const created: ApiAddress = json.data || json;
    return normalizeAddress(created);
  } catch (err) {
    console.warn('Error creating address API:', err);
    return null;
  }
}

export async function updateAddressApi(
  id: string | number,
  address: Partial<Address>,
): Promise<Address | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/addresses/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: getClientHeaders(),
        body: JSON.stringify({
          title: address.title,
          address_line_1: address.line,
          line: address.line,
          address_line_2:
            address.plaque || address.unit
              ? [
                  address.plaque ? `پلاک ${address.plaque}` : '',
                  address.unit ? `واحد ${address.unit}` : '',
                ]
                  .filter(Boolean)
                  .join('، ')
              : undefined,
          plaque: address.plaque,
          unit: address.unit,
          city: address.city,
          city_id: 1,
          postal_code: '1111111111',
          phone: address.phone,
          is_default:
            address.isDefault !== undefined ? Boolean(address.isDefault) : undefined,
          isDefault:
            address.isDefault !== undefined ? Boolean(address.isDefault) : undefined,
        }),
      },
    );
    if (!res.ok) {
      console.warn('Failed to update address API:', res.status, await res.text());
      return null;
    }
    const json = await res.json();
    const updated: ApiAddress = json.data || json;
    return normalizeAddress(updated);
  } catch (err) {
    console.warn('Error updating address API:', err);
    return null;
  }
}

export async function deleteAddressApi(id: string | number): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/addresses/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        headers: getClientHeaders(),
      },
    );
    return res.ok;
  } catch (err) {
    console.warn('Error deleting address API:', err);
    return false;
  }
}

export async function setDefaultAddressApi(
  id: string | number,
): Promise<boolean> {
  return updateAddressApi(id, { isDefault: true }).then(res => Boolean(res));
}

// Order API
export async function placeOrderApi(addressId: string | number): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getClientHeaders(),
      body: JSON.stringify({
        address_id: Number(addressId) || 1,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('Failed to place order:', res.status, err);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn('Error placing order API:', err);
    return null;
  }
}

export async function fetchOrdersApi(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: getClientHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || (Array.isArray(json) ? json : []);
  } catch (err) {
    console.warn('Error fetching orders from API:', err);
    return [];
  }
}

