'use client';

import { useEffect, useState } from 'react';

import type { Address, CartLine, Order } from '@/types';

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
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('plenty-shop'));
}

export function useShop() {
  const [state, setState] = useState<ShopState>(empty);

  useEffect(() => {
    const sync = () => setState(read());
    sync();
    window.addEventListener('plenty-shop', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('plenty-shop', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  function update(patch: (current: ShopState) => ShopState) {
    const next = patch(read());
    write(next);
    setState(next);
  }

  return {
    ...state,
    setCart(cart: CartLine[]) {
      update(current => ({ ...current, cart }));
    },
    addToCart(productId: string, qty = 1) {
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
    },
    setQty(productId: string, qty: number) {
      update(current => ({
        ...current,
        cart:
          qty <= 0
            ? current.cart.filter(line => line.productId !== productId)
            : current.cart.map(line =>
                line.productId === productId ? { ...line, qty } : line,
              ),
      }));
    },
    clearCart() {
      update(current => ({ ...current, cart: [] }));
    },
    saveAddress(address: Address) {
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
    },
    removeAddress(id: string) {
      update(current => ({
        ...current,
        addresses: current.addresses.filter(item => item.id !== id),
      }));
    },
    setDefaultAddress(id: string) {
      update(current => ({
        ...current,
        addresses: current.addresses.map(item => ({
          ...item,
          isDefault: item.id === id,
        })),
      }));
    },
    placeOrder(order: Order) {
      update(current => ({
        ...current,
        orders: [order, ...current.orders],
        cart: [],
      }));
    },
  };
}
