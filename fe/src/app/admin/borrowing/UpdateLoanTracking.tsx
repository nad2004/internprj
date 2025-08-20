'use client';

import React, { useMemo, useState } from 'react';
import { useLoanNextMutation } from '@/hooks/CRUD/useLoanNextMutation';
import { useReturnLoanMutation } from '@/hooks/CRUD/useReturnLoanMutation';
import { useRejectLoanMutation } from '@/hooks/CRUD/useRejectLoanMutation';
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
import { Textarea } from '@/components/ui/textarea';
// icons (lucide-react)
import { Clock, ClipboardList, CheckCircle2, History, AlertTriangle } from 'lucide-react';
import { ConfirmPopup } from '../../admin/borrowing/ConfirmPopup';

// Types
import type { Loan, LoanStatus } from '@/types/Borrow';

export type UpdateLoanTrackingProps = {
  selectedLoan: Loan | null;
  open?: boolean;
  onCancel: () => void;
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
    case 'pending':
      return 'reserve';
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
}: UpdateLoanTrackingProps) {
  const loan = selectedLoan;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [pendingStatus, setPendingStatus] = useState<LoanStatus | null>(null);
  const { mutateAsync: nextActionLoan, isPending, error, isSuccess } = useLoanNextMutation();
  const { mutateAsync: returnLoan, isPending: returnPending } = useReturnLoanMutation();
  const { mutateAsync: rejectLoan, isPending: rejectPending } = useRejectLoanMutation();

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
    setReturnOpen(true);
  };
  const handleRejectClick = () => {
    setRejectOpen(true);
  };
  async function handleConfirm() {
    await nextActionLoan(loan?._id || '');
    setConfirmOpen(false);
    onCancel();
  }
  async function handleReject() {
    await rejectLoan({ id: loan?._id || "", reason });
    setRejectOpen(false);
    onCancel();
  }
  async function handleReturn() {
    await returnLoan(loan?._id || "")
    setReturnOpen(false);
    onCancel();
  }
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
    <div className="w-full mx-auto p-6 space-y-4 abosolute top-0 left-0 right-0 bottom-0 overflow-y-auto">
      {/* Header */}
      {error && <div className="p-6 text-2xl text-red-700">{error.message}</div>}
      {/* Status badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={!overdue && loan.status === 'reserve' ? 'default' : 'outline'}
          className="gap-1"
        >
          <Clock className="h-4 w-4" /> Reserve
        </Badge>
        <Badge
          variant={!overdue && loan.status === 'borrowed' ? 'default' : 'outline'}
          className="gap-1"
        >
          <ClipboardList className="h-4 w-4" /> Borrowed
        </Badge>
        {overdue && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-4 w-4" /> Overdue
          </Badge>
        )}
        <Badge
          variant={!overdue && loan.status === 'returned' ? 'default' : 'outline'}
          className="gap-1"
        >
          <CheckCircle2 className="h-4 w-4" /> Returned
        </Badge>
        <Badge
          variant={!overdue && loan.status === 'cooldown' ? 'default' : 'outline'}
          className="gap-1"
        >
          <History className="h-4 w-4" /> Cooldown
        </Badge>
        {loan.status === 'rejected' && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-4 w-4" /> Rejected
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
                Mã:{' '}
                <span className="font-medium">{(loan as Loan)?.bookId?.book_id?.slug || '—'}</span>
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
            <p className="text-sm leading-relaxed break-all [overflow-wrap:anywhere]">
            {loan.description}
          </p>
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
              disabled={loan.status === 'cooldown' || isPending}
              className="w-full sm:w-auto"
            >
              {loan.status === 'cooldown' ? 'No further steps' : 'Next Step'}
            </Button>
            <Button
              variant="outline"
              onClick={handleMarkReturned}
              disabled={(loan.status !== 'borrowed' && loan.status !== 'overdue') || isPending}
              className="w-full sm:w-auto"
            >
              Mark as Returned
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectClick}
              disabled={loan.status !== 'pending' || isPending}
              className="w-full sm:w-auto"
            >
              Reject
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Status: <span className="font-medium text-foreground">{loan.status}</span>
            </span>
            {isPending && <span>Updating…</span>}
          </div>
        </CardContent>
      </Card>
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận từ chối</DialogTitle>
            <DialogDescription>Lý Do:</DialogDescription>
            <Textarea value={reason} onChange={({ target }) => setReason(target.value)} />
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={handleReject} disabled={ rejectPending}>
              Đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmPopup
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Xác nhận đổi trạng thái"
        description= {pendingStatus ? pendingStatus : "Chưa chọn thay đổi."}
        confirmText="Xác nhận"
        cancelText="Huỷ"
        onConfirm={() => handleConfirm()}
      />
      <ConfirmPopup
        open={returnOpen}
        onOpenChange={setReturnOpen}
        title="Trả sách?"
        description="Hành động này sẽ đánh dấu phiếu mượn là đã trả."
        confirmText="Xác nhận"
        cancelText="Huỷ"
        onConfirm={() => handleReturn()}
      />
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
        <DialogContent className="fixed max-w-3xl p-0 border-none shadow-none bg-slate-300 ">
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
