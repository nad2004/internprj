'use client';
import Link from 'next/link';
import { ReactNode } from 'react';

type NavigateButtonProps = {
  href: string;
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
};

export default function NavigateButton({
  href,
  className = '',
  icon,
  children,
  ...props
}: NavigateButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
}
