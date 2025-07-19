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
    <Link href={href} className={` ${className}`} {...props}>
      {icon}
      {children}
    </Link>
  );
}
