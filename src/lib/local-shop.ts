'use client';

import { useEffect, useState } from 'react';

import type { Address, CartLine, Order } from '@/types';
import {
  addToCartApi,
  clearCartApi,
  createAddressApi,
  deleteAddressApi,
  fetchAddressesApi,
  fetchCartApi,
  fetchOrdersApi,
  placeOrderApi,
  removeCartItemApi,
  setDefaultAddressApi,
  updateAddressApi,
  updateCartItemApi,
} from './api';

const KEY = 'plenty-shop';

type ShopState = {
  cart: CartLine[];
  addresses: Address[];
  orders: Order[];
};

const empty: ShopState = { cart: [], addresses: [], orders: [] };

function read(): ShopState {
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? ({ ...empty, ...JSON.parse(raw) } as ShopState) : empty;
  } catch {
    return empty;
  }
}

function write(state: ShopState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('plenty-shop'));
}

export function useShop() {
  const [state, setState] = useState<ShopState>(empty);

  function update(patch: (current: ShopState) => ShopState) {
    const next = patch(read());
    write(next);
    setState(next);
  }

  useEffect(() => {
    const sync = () => setState(read());
    sync();
    window.addEventListener('plenty-shop', sync);
    window.addEventListener('storage', sync);

    // Initial background sync from backend API
    fetchCartApi().then(apiCart => {
      if (apiCart && Array.isArray(apiCart.items)) {
        const serverCart: CartLine[] = apiCart.items.map(item => ({
          productId: String(
            item.productId || item.product_id || item.product?.slug || item.id,
          ),
          qty: Number(item.qty ?? item.quantity ?? 1),
        }));
        if (serverCart.length > 0) {
          update(current => ({ ...current, cart: serverCart }));
        }
      }
    });

    fetchAddressesApi().then(apiAddresses => {
      if (apiAddresses && apiAddresses.length > 0) {
        update(current => ({ ...current, addresses: apiAddresses }));
      }
    });

    fetchOrdersApi().then(apiOrders => {
      if (apiOrders && apiOrders.length > 0) {
        // Map backend orders if present
      }
    });

    return () => {
      window.removeEventListener('plenty-shop', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return {
    ...state,
    setCart(cart: CartLine[]) {
      update(current => ({ ...current, cart }));
    },
    async addToCart(productId: string, qty = 1) {
      // 1. Optimistic local update
      update(current => {
        const existing = current.cart.find(
          line => line.productId === productId,
        );
        const cart = existing
          ? current.cart.map(line =>
              line.productId === productId
                ? { ...line, qty: line.qty + qty }
                : line,
            )
          : [...current.cart, { productId, qty }];
        return { ...current, cart };
      });

      // 2. Real API call to beauty-center backend
      const apiCart = await addToCartApi(productId, qty);
      if (apiCart && Array.isArray(apiCart.items)) {
        const serverCart: CartLine[] = apiCart.items.map(item => ({
          productId: String(
            item.productId || item.product_id || item.product?.slug || item.id,
          ),
          qty: Number(item.qty ?? item.quantity ?? 1),
        }));
        update(current => ({ ...current, cart: serverCart }));
      }
    },
    async setQty(productId: string, qty: number) {
      // 1. Optimistic update
      update(current => ({
        ...current,
        cart:
          qty <= 0
            ? current.cart.filter(line => line.productId !== productId)
            : current.cart.map(line =>
                line.productId === productId ? { ...line, qty } : line,
              ),
      }));

      // 2. Real API call
      const apiCart =
        qty <= 0
          ? await removeCartItemApi(productId)
          : await updateCartItemApi(productId, qty);

      if (apiCart && Array.isArray(apiCart.items)) {
        const serverCart: CartLine[] = apiCart.items.map(item => ({
          productId: String(
            item.productId || item.product_id || item.product?.slug || item.id,
          ),
          qty: Number(item.qty ?? item.quantity ?? 1),
        }));
        update(current => ({ ...current, cart: serverCart }));
      }
    },
    async clearCart() {
      update(current => ({ ...current, cart: [] }));
      await clearCartApi();
    },
    async saveAddress(address: Address) {
      // 1. Optimistic update
      update(current => {
        const addresses = current.addresses.some(item => item.id === address.id)
          ? current.addresses.map(item =>
              item.id === address.id ? address : item,
            )
          : [...current.addresses, address];
        const normalized = address.isDefault
          ? addresses.map(item => ({
              ...item,
              isDefault: item.id === address.id,
            }))
          : addresses;
        return { ...current, addresses: normalized };
      });

      // 2. Real API call
      const isExisting =
        address.id && !address.id.includes('-') && !isNaN(Number(address.id));
      const saved = isExisting
        ? await updateAddressApi(address.id, address)
        : await createAddressApi(address);

      if (saved) {
        update(current => {
          const updatedList = current.addresses.map(item =>
            item.id === address.id ? saved : item,
          );
          if (!updatedList.some(item => item.id === saved.id)) {
            updatedList.push(saved);
          }
          return { ...current, addresses: updatedList };
        });
        return saved;
      }
      return address;
    },
    async removeAddress(id: string) {
      update(current => ({
        ...current,
        addresses: current.addresses.filter(item => item.id !== id),
      }));
      await deleteAddressApi(id);
    },
    async setDefaultAddress(id: string) {
      update(current => ({
        ...current,
        addresses: current.addresses.map(item => ({
          ...item,
          isDefault: item.id === id,
        })),
      }));
      await setDefaultAddressApi(id);
    },
    async placeOrder(order: Order, addressId?: string | number) {
      update(current => ({
        ...current,
        orders: [order, ...current.orders],
        cart: [],
      }));
      if (addressId) {
        await placeOrderApi(addressId);
      }
    },
  };
}
