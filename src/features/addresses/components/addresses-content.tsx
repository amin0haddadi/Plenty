'use client';

import { useState } from 'react';

import { ScreenHeader } from '@/components/layout/screen-header';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useShop } from '@/lib/local-shop';
import type { Address } from '@/types';

import { AddressCard } from './address-card';
import { AddressForm, type AddressFormValues } from './address-form';

export function AddressesContent({ phone }: { phone: string }) {
  const shop = useShop();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [removing, setRemoving] = useState<Address | null>(null);

  function close() {
    setOpen(false);
    setEditing(null);
  }

  function openNew() {
    setEditing(null);
    setOpen(true);
  }

  function save(values: AddressFormValues) {
    shop.saveAddress({
      id: editing?.id ?? crypto.randomUUID(),
      ...values,
      phone,
      isDefault: editing?.isDefault ?? shop.addresses.length === 0,
    });
    close();
  }

  function confirmRemove() {
    if (!removing) return;
    shop.removeAddress(removing.id);
    setRemoving(null);
  }

  return (
    <div className='pb-6'>
      <ScreenHeader title='آدرس‌های من' />
      {shop.addresses.length === 0 ? (
        <EmptyState
          className='mx-5 mt-10'
          title='هنوز آدرسی ثبت نکردی'
          description='برای دریافت سفارش، یک آدرس اضافه کن.'
          action={<Button onClick={openNew}>+ افزودن آدرس</Button>}
        />
      ) : (
        <div className='mx-2 space-y-3 px-4'>
          {shop.addresses.map(address => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => {
                setEditing(address);
                setOpen(true);
              }}
              onRemove={() => setRemoving(address)}
              onSetDefault={() => shop.setDefaultAddress(address.id)}
            />
          ))}
          <Button variant='block' onClick={openNew}>
            + افزودن آدرس جدید
          </Button>
        </div>
      )}
      {open ? (
        <BottomSheet onClose={close}>
          <AddressForm
            key={editing?.id ?? 'new'}
            phone={phone}
            address={editing}
            heading={editing ? 'ویرایش آدرس' : 'آدرس جدید'}
            submitLabel={editing ? 'ذخیره تغییرات' : 'ذخیره'}
            onSave={save}
          />
        </BottomSheet>
      ) : null}
      {removing ? (
        <BottomSheet onClose={() => setRemoving(null)}>
          <div className='min-h-[200px] w-full max-w-[430px] rounded-t-3xl bg-white p-5 text-center'>
            <h2 className='font-display text-lg font-bold'>حذف آدرس</h2>
            <p className='mt-3 text-sm text-muted'>
              از حذف آدرس «{removing.title}» مطمئن هستید؟
            </p>
            <div className='mt-6 flex flex-col gap-2'>
              <Button
                variant='block'
                className='bg-danger'
                onClick={confirmRemove}
              >
                حذف آدرس
              </Button>
              <Button variant='outline' onClick={() => setRemoving(null)}>
                انصراف
              </Button>
            </div>
          </div>
        </BottomSheet>
      ) : null}
    </div>
  );
}
