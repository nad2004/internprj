'use client';

import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// icons (lucide-react)
import { Clock, ClipboardList, CheckCircle2, History, AlertTriangle } from 'lucide-react';

// Types
import type { Loan, LoanStatus } from '@/types/Borrow';

export type UpdateLoanTrackingProps = {
  /** Dữ liệu loan truyền từ page (giống selectedUser trong UpdateUserPopup) */
  selectedLoan: Loan | null;
  /** Nếu truyền, component sẽ hiển thị trong Dialog của shadcn (giống popup) */
  open?: boolean;
  /** Đóng popup */
  onCancel: () => void;
  /** Gọi sau khi cập nhật trạng thái thành công, trả về loan mới từ server */
  onUpdate: (updated: Loan) => void;
};

const API = process.env.NEXT_PUBLIC_API_URL || '';

function formatDate(iso?: string) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return iso as string;
  }
}

function isOverdue(loan?: Loan | null) {
  if (!loan) return false;
  if (loan.status === 'returned' || loan.status === 'cooldown') return false;
  const due = loan.dueAt ? new Date(loan.dueAt).getTime() : NaN;
  return Number.isFinite(due) && Date.now() > due;
}

function nextStatus(current: LoanStatus): LoanStatus | null {
  switch (current) {
    case 'reserve':
      return 'borrowed';
    case 'borrowed':
      return 'returned';
    case 'returned':
      return 'cooldown';
    default:
      return null; // 'cooldown' (terminal) or unknown
  }
}

export default function UpdateLoanTracking({
  selectedLoan,
  open,
  onCancel,
  onUpdate,
}: UpdateLoanTrackingProps) {
  const loan = selectedLoan;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<LoanStatus | null>(null);

  const updateMutation = useMutation({
    mutationFn: async (status: LoanStatus) => {
      if (!loan?._id) throw new Error('Missing loan id');
      const { data } = await axios.put(`${API}/loan/${loan._id}/status`, { status });
      return data as Loan;
    },
    onSuccess: (updated) => {
      setConfirmOpen(false);
      setPendingStatus(null);
      onUpdate(updated);
    },
  });

  const overdue = useMemo(() => isOverdue(loan), [loan]);

  const handleNextClick = () => {
    if (!loan) return;
    const ns = nextStatus(loan.status);
    if (!ns) return;
    setPendingStatus(ns);
    setConfirmOpen(true);
  };

  const handleMarkReturned = () => {
    if (!loan) return;
    setPendingStatus('returned');
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (pendingStatus) updateMutation.mutate(pendingStatus);
  };

  if (!loan) {
    return (
      <Alert className="m-6" variant="destructive">
        <AlertTitle>Thiếu dữ liệu</AlertTitle>
        <AlertDescription>
          Hãy truyền <code>selectedLoan</code> (giống cách truyền <code>selectedUser</code> trong{' '}
          <code>UpdateUserPopup</code>).
        </AlertDescription>
      </Alert>
    );
  }

  const Content = (
    <div className="w-full mx-auto p-6 space-y-4 ">
      {/* Header */}

      {/* Status badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={loan.status === 'reserve' ? 'default' : 'outline'} className="gap-1">
          <Clock className="h-4 w-4" /> Reserve
        </Badge>
        <Badge variant={loan.status === 'borrowed' ? 'default' : 'outline'} className="gap-1">
          <ClipboardList className="h-4 w-4" /> Borrowed
        </Badge>
        <Badge variant={loan.status === 'returned' ? 'default' : 'outline'} className="gap-1">
          <CheckCircle2 className="h-4 w-4" /> Returned
        </Badge>
        <Badge variant={loan.status === 'cooldown' ? 'default' : 'outline'} className="gap-1">
          <History className="h-4 w-4" /> Cooldown
        </Badge>
        {overdue && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-4 w-4" /> Overdue
          </Badge>
        )}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Borrow Summary</CardTitle>
          <CardDescription>Thông tin mượn và đối tượng liên quan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-sm">
              <div>
                Mã: <span className="font-medium">{(loan as Loan)?._id || '—'}</span>
              </div>
              <div>Borrowed at: {formatDate(loan.borrowedAt)}</div>
              <div>Due at: {formatDate(loan.dueAt)}</div>
              {overdue && <div className="text-destructive">Quá hạn!!!</div>}
            </div>
            <div className="space-y-2 text-sm">
              <div>
                User: <span className="font-medium">{(loan as Loan)?.userId?.username || '—'}</span>
              </div>
              <div>
                Book:{' '}
                <span className="font-medium">{(loan as Loan)?.bookId?.book_id?.title || '—'}</span>
              </div>
              <div>Serial: {(loan as Loan)?.bookId?.code || '—'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loan.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ghi chú</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{loan.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleNextClick}
              disabled={loan.status === 'cooldown' || updateMutation.isPending}
              className="w-full sm:w-auto"
            >
              {loan.status === 'cooldown' ? 'No further steps' : 'Next Step'}
            </Button>
            <Button
              variant="outline"
              onClick={handleMarkReturned}
              disabled={loan.status !== 'borrowed' || updateMutation.isPending}
              className="w-full sm:w-auto"
            >
              Mark as Returned
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Status: <span className="font-medium text-foreground">{loan.status}</span>
            </span>
            {updateMutation.isPending && <span>Updating…</span>}
          </div>
        </CardContent>
      </Card>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đổi trạng thái</DialogTitle>
            <DialogDescription>
              {pendingStatus ? (
                <>
                  Chuyển trạng thái sang <span className="font-medium">{pendingStatus}</span>?
                </>
              ) : (
                <>Chưa chọn thay đổi.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={handleConfirm} disabled={!pendingStatus || updateMutation.isPending}>
              Đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // Nếu có prop `open`, hiển thị như popup Dialog. Nếu không, parent có thể render điều kiện `{show && <UpdateLoanTracking .../>}`.
  if (typeof open === 'boolean') {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) onCancel();
        }}
      >
        <DialogContent className="max-w-3xl p-0 border-none shadow-none bg-slate-300 ">
          <DialogTitle className="text-center text-[16px] font-semibold mt-3">
            Theo dõi và cập nhật trạng thái mượn sách
          </DialogTitle>
          {Content}
        </DialogContent>
      </Dialog>
    );
  }

  return Content;
}
