'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { LuPencil } from 'react-icons/lu';

import { ScreenHeader } from '@/components/layout/screen-header';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { PriceRow } from '@/components/ui/price-row';
import { getProduct } from '@/data/products';
import {
  AddressForm,
  type AddressFormValues,
} from '@/features/addresses/components/address-form';
import { cartSubtotal, shippingFor } from '@/lib/commerce';
import { formatNumber, formatToman } from '@/lib/format';
import { useShop } from '@/lib/local-shop';
import type { Address, Order } from '@/types';

function createOrderId() {
  return `KH-${Math.floor(10000 + Math.random() * 89999)}`;
}

export function CheckoutContent({ phone }: { phone: string }) {
  const router = useRouter();
  const shop = useShop();
  const [sheet, setSheet] = useState<'picker' | 'form' | null>(null);
  const [editing, setEditing] = useState<Address | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const subtotal = cartSubtotal(shop.cart);
  const shipping = shippingFor(subtotal);
  const selected =
    shop.addresses.find(item => item.id === selectedId) ??
    shop.addresses.find(item => item.isDefault) ??
    shop.addresses[0];
  const lines = shop.cart
    .map(line => ({ ...line, product: getProduct(line.productId) }))
    .filter(line => line.product);

  function closeSheet() {
    setSheet(null);
    setEditing(null);
  }

  function openForm(address: Address | null = null) {
    setEditing(address);
    setSheet('form');
  }

  function saveAddress(values: AddressFormValues) {
    const id = editing?.id ?? crypto.randomUUID();
    shop.saveAddress({
      id,
      ...values,
      phone,
      isDefault: editing?.isDefault ?? shop.addresses.length === 0,
    });
    setSelectedId(id);
    closeSheet();
  }

  function pickAddress(id: string) {
    setSelectedId(id);
    closeSheet();
  }

  function pay() {
    if (!selected || lines.length === 0) return;
    const order: Order = {
      id: createOrderId(),
      status: 'waiting_courier',
      items: lines.map(line => ({
        productId: line.productId,
        name: line.product!.name,
        qty: line.qty,
        unit: line.product!.unit,
        price: line.product!.price,
        image: line.product!.image,
      })),
      subtotal,
      shippingLabel: shipping.label,
      total: subtotal,
      createdAt: new Date().toISOString(),
      addressTitle: selected.title,
      addressLine: `${selected.city}، ${selected.line}، پلاک ${selected.plaque}`,
      phone: selected.phone,
      eta: 'امروز ۱۹ تا ۲۰',
    };
    shop.placeOrder(order);
    router.push(`/order-confirmed?id=${order.id}`);
  }

  return (
    <div className='pb-6'>
      <ScreenHeader title='تکمیل سفارش' />
      <section className='px-4'>
        <h2 className='mb-2 text-sm font-bold'>۱. آدرس تحویل</h2>
        {selected ? (
          <div className='flex items-start justify-between gap-3 rounded-2xl border border-fresh bg-white p-4'>
            <div>
              <p className='font-semibold'>{selected.title}</p>
              <p className='mt-1 text-sm text-muted'>
                {selected.city}، {selected.line}
              </p>
            </div>
            <Button
              type='button'
              variant='minusSm'
              aria-label='ویرایش'
              onClick={() => openForm(selected)}
            >
              <LuPencil className='size-4' aria-hidden />
            </Button>
          </div>
        ) : (
          <div className='rounded-2xl bg-white p-4 text-center text-sm'>
            آدرسی انتخاب نشده
          </div>
        )}
        <div className='mt-3 flex flex-row gap-2'>
          {shop.addresses.length > 0 ? (
            <Button variant='outline' onClick={() => setSheet('picker')}>
              تغییر آدرس
            </Button>
          ) : null}
          <Button
            variant='outline'
            className='w-full bg-chip!'
            onClick={() => openForm(null)}
          >
            + افزودن آدرس جدید
          </Button>
        </div>
      </section>

      <section className='mt-5 px-4'>
        <h2 className='mb-2 text-sm font-bold'>۲. اقلام سفارش</h2>
        <div className='rounded-2xl bg-white p-4 text-sm'>
          {lines.map(line => (
            <div key={line.productId} className='flex justify-between py-1'>
              <span>{formatNumber(line.product!.price * line.qty)}</span>
              <span>
                {line.product!.name} × {line.qty} {line.product!.unit}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className='mt-5 px-4'>
        <h2 className='mb-2 text-sm font-bold'>۳. خلاصه پرداخت</h2>
        <div className='rounded-2xl bg-white p-4 text-sm'>
          {shipping.isFree ? (
            <p className='mb-2 rounded-xl bg-chip py-2 text-center text-xs'>
              ارسال رایگان برای این سفارش
            </p>
          ) : null}
          <PriceRow label='جمع اقلام' value={formatToman(subtotal)} />
          <PriceRow label='هزینه ارسال' value={shipping.label} />
          <div className='my-2 h-px bg-line' />
          <PriceRow
            label='مبلغ قابل پرداخت'
            value={formatToman(subtotal)}
            strong
          />
        </div>
      </section>

      <div className='px-4 pt-4'>
        <Button
          variant='split'
          disabled={!selected || lines.length === 0}
          onClick={pay}
        >
          <span>پرداخت</span>
          <span>{formatToman(subtotal)}</span>
        </Button>
      </div>

      {sheet === 'picker' ? (
        <BottomSheet onClose={closeSheet}>
          <div className='w-full max-w-[430px] rounded-t-3xl bg-white p-5'>
            <h2 className='mb-4 text-center font-display text-lg font-bold'>
              انتخاب آدرس
            </h2>
            <div className='space-y-3'>
              {shop.addresses.map(address => {
                const isSelected = selected?.id === address.id;
                return (
                  <button
                    key={address.id}
                    type='button'
                    onClick={() => pickAddress(address.id)}
                    className={`w-full rounded-2xl border p-4 text-right ${
                      isSelected
                        ? 'border-fresh bg-chip/40'
                        : 'border-line bg-cream'
                    }`}
                  >
                    <p className='font-semibold'>{address.title}</p>
                    <p className='mt-1 text-sm text-muted'>
                      {address.city}، {address.line}
                    </p>
                    <p className='text-sm text-muted'>
                      پلاک {address.plaque}
                      {address.unit ? `، واحد ${address.unit}` : ''}
                    </p>
                  </button>
                );
              })}
            </div>
            <Button
              variant='outline'
              className='mt-4'
              onClick={() => openForm(null)}
            >
              + افزودن آدرس جدید
            </Button>
          </div>
        </BottomSheet>
      ) : null}

      {sheet === 'form' ? (
        <BottomSheet onClose={closeSheet}>
          <AddressForm
            key={editing?.id ?? 'new'}
            phone={phone}
            address={editing}
            heading={editing ? 'ویرایش آدرس' : 'آدرس جدید'}
            submitLabel={editing ? 'ذخیره تغییرات' : 'ذخیره آدرس'}
            onSave={saveAddress}
          />
        </BottomSheet>
      ) : null}
    </div>
  );
}
