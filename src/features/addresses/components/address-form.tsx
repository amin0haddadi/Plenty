'use client';

import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import type { Address } from '@/types';

export type AddressFormValues = {
  title: string;
  city: string;
  line: string;
  plaque: string;
  unit: string;
  phone: string;
};

const cities = ['ابهر', 'خرمدره'] as const;

const fields = [
  { name: 'title', label: 'عنوان' },
  { name: 'line', label: 'آدرس کامل' },
  { name: 'plaque', label: 'پلاک' },
  { name: 'unit', label: 'واحد' },
] as const;

function cityValue(city: string | undefined) {
  return cities.some((item) => item === city) ? city! : cities[0];
}

export function AddressForm({
  phone,
  address,
  heading,
  submitLabel,
  onSave,
}: {
  phone: string;
  address?: Address | null;
  heading: string;
  submitLabel: string;
  onSave: (values: AddressFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    defaultValues: {
      title: address?.title ?? 'خانه',
      city: cityValue(address?.city),
      line: address?.line ?? '',
      plaque: address?.plaque ?? '',
      unit: address?.unit ?? '',
      phone,
    },
  });

  return (
    <form
      className="w-full max-w-[430px] rounded-t-3xl bg-white p-5"
      onSubmit={handleSubmit((values) =>
        onSave({
          ...values,
          title: values.title.trim(),
          city: cityValue(values.city),
          line: values.line.trim(),
          plaque: values.plaque.trim(),
          unit: values.unit.trim(),
          phone,
        }),
      )}
    >
      <h2 className="mb-4 text-center font-display text-lg font-bold">{heading}</h2>
      <label className="mb-2 block text-xs text-muted">
        عنوان
        <input
          {...register('title', { validate: (value) => value.trim().length > 0 || 'عنوان را وارد کنید' })}
          className={`mt-1 h-11 w-full rounded-xl border bg-cream px-3 text-sm outline-none ${
            errors.title ? 'border-danger text-danger' : 'border-line text-leaf'
          }`}
        />
        {errors.title ? <span className="mt-1 block text-danger">{errors.title.message}</span> : null}
      </label>
      <fieldset className="mb-2">
        <legend className="text-xs text-muted">شهر</legend>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {cities.map((city) => (
            <label
              key={city}
              className="flex h-11 items-center gap-2 rounded-xl border border-line bg-cream px-3 text-sm text-leaf has-checked:border-leaf has-checked:bg-chip"
            >
              <input
                type="radio"
                value={city}
                {...register('city', { required: 'شهر را انتخاب کنید' })}
                className="size-4 accent-leaf"
              />
              {city}
            </label>
          ))}
        </div>
        {errors.city ? <span className="mt-1 block text-xs text-danger">{errors.city.message}</span> : null}
      </fieldset>
      {fields.slice(1).map((field) => (
        <label key={field.name} className="mb-2 block text-xs text-muted">
          {field.label}
          <input
            {...register(field.name, {
              validate: (value) => field.name === 'unit' || value.trim().length > 0 || `${field.label} را وارد کنید`,
            })}
            className={`mt-1 h-11 w-full rounded-xl border bg-cream px-3 text-sm outline-none ${
              errors[field.name] ? 'border-danger text-danger' : 'border-line text-leaf'
            }`}
          />
          {errors[field.name] ? <span className="mt-1 block text-danger">{errors[field.name]?.message}</span> : null}
        </label>
      ))}
      <label className="mb-2 block text-xs text-muted">
        شماره تماس
        <input
          value={phone}
          disabled
          className="mt-1 h-11 w-full rounded-xl border border-line bg-cream px-3 text-sm text-muted outline-none"
        />
      </label>
      <Button type="submit" variant="block" className="mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}
