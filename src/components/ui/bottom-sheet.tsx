'use client';

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react';

const interactive = 'input, textarea, button, select, a';

export function BottomSheet({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const fromHandle = useRef(false);
  const startY = useRef(0);
  const offsetRef = useRef(0);
  const onCloseRef = useRef(onClose);
  const finishRef = useRef<() => void>(() => {});

  function moveTo(value: number) {
    offsetRef.current = value;
    setOffset(value);
  }

  function begin(clientY: number) {
    draggingRef.current = true;
    setDragging(true);
    startY.current = clientY;
  }

  function finish() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (offsetRef.current > 80) onCloseRef.current();
    else moveTo(0);
  }

  useEffect(() => {
    onCloseRef.current = onClose;
    finishRef.current = finish;
  });

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    function onTouchStart(event: TouchEvent) {
      if (!panel) return;
      const target = event.target as HTMLElement;
      if (target.closest(interactive)) return;
      fromHandle.current = Boolean(target.closest('[data-sheet-handle]'));
      if (!fromHandle.current && panel.scrollTop > 0) return;
      begin(event.touches[0].clientY);
    }

    function onTouchMove(event: TouchEvent) {
      if (!panel || !draggingRef.current) return;
      const delta = event.touches[0].clientY - startY.current;
      const canScroll = panel.scrollHeight > panel.clientHeight;
      if (!fromHandle.current && delta < 0 && canScroll) {
        draggingRef.current = false;
        setDragging(false);
        moveTo(0);
        return;
      }
      if (event.cancelable) event.preventDefault();
      moveTo(Math.max(0, delta));
    }

    const endDrag = () => finishRef.current();
    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    panel.addEventListener('touchmove', onTouchMove, { passive: false });
    panel.addEventListener('touchend', endDrag);
    panel.addEventListener('touchcancel', endDrag);
    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchmove', onTouchMove);
      panel.removeEventListener('touchend', endDrag);
      panel.removeEventListener('touchcancel', endDrag);
    };
  }, []);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') return;
    const target = event.target as HTMLElement;
    if (target.closest(interactive)) return;
    begin(event.clientY);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // The drag still follows the pointer without capture.
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch' || !draggingRef.current) return;
    moveTo(Math.max(0, event.clientY - startY.current));
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') return;
    finish();
  }

  return (
    <div className='fixed inset-0 z-30 flex items-end justify-center'>
      <button
        type='button'
        aria-label='بستن'
        className='absolute inset-0 bg-leaf/40'
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className='relative max-h-[90dvh] w-full max-w-[430px] overflow-y-auto overscroll-contain'
        style={{
          transform: `translateY(${offset}px)`,
          transition: dragging ? 'none' : 'transform 200ms ease-out',
        }}
        onClick={event => event.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          data-sheet-handle
          className='absolute inset-x-0 top-0 z-10 flex h-8 touch-none items-center justify-center'
        >
          <span className='h-1.5 w-10 rounded-full bg-line' />
        </div>
        {children}
      </div>
    </div>
  );
}
