'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Loan } from '@/types/Borrow';
import { useReturnLoanMutation } from '@/hooks/CRUD/useReturnLoanMutation';
export type LoanCardProps = {
  loan: Loan;
};
export default function BorrowCard({ loan }: LoanCardProps) {
  const { mutateAsync: returnLoan, isPending } = useReturnLoanMutation();
  const dueAtLabel = loan.dueAt
    ? new Date(loan.dueAt as string).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '-';

  return (
    <>
      <Card className="border rounded-2xl shadow-sm">
        <CardContent className="p-4">
          {/* Desktop / tablet layout */}
          <div className="hidden md:grid md:grid-cols-5 items-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={loan.bookId?.book_id?.imageLinks?.thumbnail ?? '/placeholder.png'}
                alt={`Cover of ${loan.bookId?.book_id?.title}`}
                className="object-cover"
                width={50}
                height={50}
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="truncate font-medium leading-tight">
                {loan.bookId?.book_id?.title}
              </div>
            </div>
            <div className="text-center text-sm md:border-l md:pl-4">{loan.bookId?.code}</div>

            {/* Usage */}
            <div className="text-center text-sm md:border-l md:pl-4">{dueAtLabel}</div>

            {/* Format */}
            <div className="text-center text-sm md:border-l md:pl-4">{loan.status}</div>

           
          </div>
        </CardContent>
      </Card>
      
    </>
  );
}
