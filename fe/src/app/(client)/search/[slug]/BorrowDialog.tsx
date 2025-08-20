'use client';

import * as React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { bookInstanceQueries } from '@/lib/api/bookInstance';
import { useCreateLoan } from '@/hooks/CRUD/useCreateLoan';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUserStore, UserState } from '@/store/userStore';
import ClientFilter from '@/icons/ClientFilter.svg';
import Success from '@/icons/Success.svg';
import { z } from "zod";
import type { BorrowPayload } from '@/types/Borrow';

type View = 'form' | 'success';
type DMY = { d: string; m: string; y: string };
const toDate = (p: DMY) =>
  new Date(Number(p.y), Number(p.m) - 1, Number(p.d), 0, 0, 0, 0);
const isValidDMY = (p: DMY) => {
  const d = toDate(p);
  return (
    d.getFullYear() === Number(p.y) &&
    d.getMonth() === Number(p.m) - 1 &&
    d.getDate() === Number(p.d)
  );
};
const startOfToday = (() => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
})();

/* Zod schema */
const dmySchema = z
  .object({
    d: z.string().regex(/^\d{2}$/),
    m: z.string().regex(/^\d{2}$/),
    y: z.string().regex(/^\d{4}$/),
  })
  .refine(isValidDMY, "Invalid date");

const BorrowPayloadSchema = z
  .object({
    from: dmySchema,
    to: dmySchema,
    serial: z.string().min(1, "Serial is required"),
    userId: z.string().min(1, "User is required"),
    bookInstanceId: z.string().min(1, "BookInstance is required"),
    description: z.string().optional(),
  })
  .superRefine(({ from, to }, ctx) => {
    const f = toDate(from);
    const t = toDate(to);
    if (f < startOfToday) {
      ctx.addIssue({ code: "custom", path: ["from"], message: "From cannot be in the past" });
    }
    if (t < startOfToday) {
      ctx.addIssue({ code: "custom", path: ["to"], message: "To cannot be in the past" });
    }
    if (t < f) {
      ctx.addIssue({ code: "custom", path: ["to"], message: "To must be on or after From" });
    }
  });

export default function BorrowDialog({
  bookId,
  trigger,
}: {
  bookId: string;
  trigger: React.ReactNode;
}) {
  /** Điều khiển mở/đóng dialog để fetch “lười” */
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<View>('form');
  const profile = useUserStore((u) => (u as UserState).profile);

  /** Date options */
  const days = React.useMemo(
    () => Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')),
    [],
  );
  const months = React.useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')),
    [],
  );
  const years = React.useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(now + i));
  }, []);

  /** Fetch bản copy khả dụng – chỉ fetch khi dialog mở */
  const {
    data: availableDetail,
    isFetching,
    isError,
    error,
  } = useQuery({
    ...bookInstanceQueries.availableDetail(bookId),
    enabled: open && !!bookId,
  });

  /** Form state */
  const [fromD, setFromD] = React.useState(days[0]);
  const [fromM, setFromM] = React.useState(months[0]);
  const [fromY, setFromY] = React.useState(years[0]);

  const [toD, setToD] = React.useState(days[4] ?? days[0]);
  const [toM, setToM] = React.useState(months[0]);
  const [toY, setToY] = React.useState(years[0]);

  const [serial, setSerial] = React.useState(''); // đồng bộ từ API
  const [desc, setDesc] = React.useState('');

  /** Khi dữ liệu khả dụng về -> đồng bộ serial */
  React.useEffect(() => {
    if (availableDetail?.code) setSerial(String(availableDetail.code));
  }, [availableDetail]);

  /** Tạo phiếu mượn */
  const createLoan = useCreateLoan({ bookId });
  const submitting = createLoan.isPending;

  const borrowDisabled = submitting || isFetching || isError || !serial || !bookId;

  /** Reset toàn bộ form khi đóng dialog */
  function reset() {
    setFromD(days[0]);
    setFromM(months[0]);
    setFromY(years[0]);
    setToD(days[4] ?? days[0]);
    setToM(months[0]);
    setToY(years[0]);
    setSerial('');
    setDesc('');
    setView('form');
  }

  function onOpenChange(v: boolean) {
    setOpen(v);
    if (!v) reset();
    else setView('form');
  }

  /** ----- Disable logic cho input ngày ----- */
  const now = React.useMemo(() => {
    const d = new Date(); d.setHours(0,0,0,0);
    return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
  }, []);

  // From: cấm chọn quá khứ (so với hôm nay)
  const disabledFromMonths = React.useMemo(() => {
    const s = new Set<string>();
    if (Number(fromY) === now.y) {
      for (let m = 1; m < now.m; m++) s.add(String(m).padStart(2, '0'));
    }
    return s;
  }, [fromY, now]);

  const disabledFromDays = React.useMemo(() => {
    const s = new Set<string>();
    if (Number(fromY) === now.y && Number(fromM) === now.m) {
      for (let d = 1; d < now.d; d++) s.add(String(d).padStart(2, '0'));
    }
    return s;
  }, [fromY, fromM, now]);

  // To: cấm chọn < From
  const disabledToYears = React.useMemo(() => {
    const s = new Set<string>();
    for (const y of years) if (Number(y) < Number(fromY)) s.add(y);
    return s;
  }, [years, fromY]);

  const disabledToMonths = React.useMemo(() => {
    const s = new Set<string>();
    if (Number(toY) === Number(fromY)) {
      for (let m = 1; m < Number(fromM); m++) s.add(String(m).padStart(2, '0'));
    }
    return s;
  }, [toY, fromY, fromM]);

  const disabledToDays = React.useMemo(() => {
    const s = new Set<string>();
    if (Number(toY) === Number(fromY) && Number(toM) === Number(fromM)) {
      for (let d = 1; d < Number(fromD); d++) s.add(String(d).padStart(2, '0'));
    }
    return s;
  }, [toY, toM, fromY, fromM, fromD]);

  async function handleSubmit() {
    if (borrowDisabled) return;
    const payload: BorrowPayload = {
      from: { d: fromD, m: fromM, y: fromY },
      to: { d: toD, m: toM, y: toY },
      serial,
      description: desc,
      userId: profile?._id || '',
      bookInstanceId: (availableDetail as any)?._id,
    };

    // ✅ Validate đầu vào bằng Zod trước khi gọi API
    const parsed = BorrowPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message ?? "Invalid date");
      return;
    }

    try {
      await createLoan.mutateAsync(payload);
      setView('success');
    } catch {
      // (có thể toast lỗi ở đây)
    }
  }

  function getErrMsg(e: unknown, fallback = 'Failed to load availability') {
    if (axios.isAxiosError(e)) {
      const data = e.response?.data as { message?: string } | undefined;
      return data?.message ?? e.message ?? fallback;
    }
    if (e instanceof Error) return e.message || fallback;
    return fallback;
  }

  const pill = 'h-10 rounded-sm border border-slate-200 bg-slate-50 text-slate-700';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="overflow-hidden rounded-2xl p-0 sm:max-w-xs">
        {/* accent bar */}
        <div className="h-[6px] w-full bg-[#F76B56]" />

        {/* SUCCESS VIEW */}
        {view === 'success' ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
            <h3 className="text-[18px] font-semibold">Process Completed</h3>
            <Success className="my-10 h-38 w-38" />
            <Button
              className="mt-6 h-11 w-[220px] rounded-xl bg-[#F76B56] text-white hover:brightness-95"
              onClick={() => setOpen(false)}
            >
              Back
            </Button>
          </div>
        ) : (
          /* FORM VIEW */
          <div className="p-6">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-center text-[16px] font-semibold">
                Fill Up the Details
              </DialogTitle>
            </DialogHeader>

            {/* Thông tin nhanh */}
            {open && (
              <div className="mb-3 text-xs text-slate-500">
                {isFetching && 'Loading available copies…'}
                {isError && <span className="text-[14px] text-red-600">{getErrMsg(error)}</span>}
                {!isFetching && !isError && availableDetail && (
                  <span className="text-[15px] font-bold text-black">
                    {availableDetail.book_id?.title ?? '—'}
                  </span>
                )}
              </div>
            )}

            {/* From */}
            <div className="mb-3 text-[13px] font-medium text-slate-700">From</div>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <DateSelect value={fromD} onChange={setFromD} items={days}   className={pill} disabledValues={disabledFromDays} />
              <DateSelect value={fromM} onChange={setFromM} items={months} className={pill} disabledValues={disabledFromMonths} />
              <DateSelect value={fromY} onChange={setFromY} items={years}  className={pill} />
            </div>

            {/* To */}
            <div className="mb-3 text-[13px] font-medium text-slate-700">To</div>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <DateSelect value={toD} onChange={setToD} items={days}   className={pill} disabledValues={disabledToDays} />
              <DateSelect value={toM} onChange={setToM} items={months} className={pill} disabledValues={disabledToMonths} />
              <DateSelect value={toY} onChange={setToY} items={years}  className={pill} disabledValues={disabledToYears} />
            </div>

            {/* Serial (đọc-chỉ, sync từ API) */}
            <label className="mb-1 block text-[12px] font-medium text-slate-600">
              Book Serial No.
            </label>
            <div className="relative mb-4">
              <Input
                value={serial}
                readOnly
                placeholder="Book…"
                className="h-10 rounded-lg border-slate-200 bg-white pr-10"
              />
              <button
                type="button"
                disabled
                title="Scan"
                className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-md text-[#F76B56] hover:bg-[#F76B56]/10"
              >
                <ClientFilter className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <label className="mb-1 block text-[12px] font-medium text-slate-600">Description</label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Purpose"
              className="w-full max-w-full min-h-[96px] resize-none rounded-lg border-slate-200 bg-white"
            />

            <DialogFooter className="mt-6">
              <Button
                className="mx-auto h-11 w-[220px] rounded-xl bg-[#F76B56] text-white hover:brightness-95 disabled:opacity-60"
                onClick={handleSubmit}
                disabled={borrowDisabled}
                title={isError ? 'Cannot fetch availability' : undefined}
              >
                {submitting ? 'PROCESSING…' : 'BORROW'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Subcomponents ---------- */

function DateSelect({
  value,
  onChange,
  items,
  className,
  disabledValues,
}: {
  value: string;
  onChange: (v: string) => void;
  items: string[];
  className?: string;
  disabledValues?: Set<string>;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`${className} justify-between`}>
        <SelectValue placeholder="--" />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {items.map((i) => (
          <SelectItem key={i} value={i} disabled={disabledValues?.has(i)}>
            {i}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
