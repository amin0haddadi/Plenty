import { LuPencil, LuTrash2 } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import type { Address } from '@/types';

export function AddressCard({
  address,
  onEdit,
  onRemove,
  onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onRemove: () => void;
  onSetDefault?: () => void;
}) {
  return (
    <article
      className={`rounded-2xl p-4 transition-all duration-400 ${
        address.isDefault
          ? 'scale-105 border border-fresh bg-white shadow-lg'
          : 'border border-line bg-gray-100'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <p className='font-bold'>{address.title}</p>
          <div className='flex items-center gap-2'>
            <LuPencil
              className='size-4 cursor-pointer text-leaf/50'
              aria-hidden
              onClick={onEdit}
            />
            <LuTrash2
              className='size-4 cursor-pointer text-danger/50'
              aria-hidden
              onClick={onRemove}
            />
          </div>
        </div>
        {address.isDefault ? (
          <span className='rounded-lg bg-chip px-2 py-1 text-xs'>پیش‌فرض</span>
        ) : (
          <span />
        )}
      </div>
      <p className='mt-3 text-sm text-muted'>
        {address.city}، {address.line}
      </p>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted'>
          پلاک {address.plaque}
          {address.unit ? `، واحد ${address.unit}` : ''}
        </p>
        <p className='mt-1 text-sm'>{address.phone}</p>
      </div>

      <div className='mt-4 flex items-center justify-between text-sm'>
        {!address.isDefault && onSetDefault ? (
          <Button
            variant='fresh'
            onClick={onSetDefault}
            className='text-blue-400!'
          >
            انتخاب به عنوان پیش‌فرض
          </Button>
        ) : (
          <span />
        )}
      </div>
    </article>
  );
}
