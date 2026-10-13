"use client";

import { useState } from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";

import { ScreenHeader } from "@/components/layout/screen-header";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useShop } from "@/lib/local-shop";

import type { Address } from "@/types";

import { AddressForm, type AddressFormValues } from "./address-form";

export function AddressesContent({ phone }: { phone: string }) {
  const shop = useShop();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

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

  return (
    <div className="pb-6">
      <ScreenHeader title="آدرس‌های من" />
      {shop.addresses.length === 0 ? (
        <EmptyState
          className="mx-5 mt-10"
          title="هنوز آدرسی ثبت نکردی"
          description="برای دریافت سفارش، یک آدرس اضافه کن."
          action={<Button onClick={openNew}>+ افزودن آدرس</Button>}
        />
      ) : (
        <div className="space-y-3 px-4">
          {shop.addresses.map((address) => (
            <article
              key={address.id}
              className={`rounded-2xl bg-white p-4 ${address.isDefault ? "border border-fresh" : "border border-line"}`}
            >
              <div className="flex items-center justify-between">
                {address.isDefault ? (
                  <span className="rounded-lg bg-chip px-2 py-1 text-xs">
                    پیش‌فرض
                  </span>
                ) : (
                  <span />
                )}
                <p className="font-bold">{address.title}</p>
              </div>
              <p className="mt-3 text-sm text-muted">
                {address.city}، {address.line}
              </p>
              <p className="text-sm text-muted">
                پلاک {address.plaque}
                {address.unit ? `، واحد ${address.unit}` : ""}
              </p>
              <p className="mt-1 text-sm">{address.phone}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Button
                    variant="minusSm"
                    aria-label="ویرایش"
                    onClick={() => {
                      setEditing(address);
                      setOpen(true);
                    }}
                  >
                    <LuPencil className="size-4" aria-hidden />
                  </Button>
                  <Button
                    variant="trashSm"
                    aria-label="حذف"
                    onClick={() => shop.removeAddress(address.id)}
                  >
                    <LuTrash2 className="size-4" aria-hidden />
                  </Button>
                </div>
                {!address.isDefault ? (
                  <Button
                    variant="fresh"
                    onClick={() => shop.setDefaultAddress(address.id)}
                  >
                    انتخاب به عنوان پیش‌فرض
                  </Button>
                ) : (
                  <span />
                )}
              </div>
            </article>
          ))}
          <Button variant="block" onClick={openNew}>
            + افزودن آدرس جدید
          </Button>
        </div>
      )}
      {open ? (
        <BottomSheet onClose={close}>
          <AddressForm
            key={editing?.id ?? "new"}
            phone={phone}
            address={editing}
            heading={editing ? "ویرایش آدرس" : "آدرس جدید"}
            submitLabel={editing ? "ذخیره تغییرات" : "ذخیره"}
            onSave={save}
          />
        </BottomSheet>
      ) : null}
    </div>
  );
}
