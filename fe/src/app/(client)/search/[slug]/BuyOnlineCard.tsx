'use client';

import Image from 'next/image';
import Link from 'next/link';

type Merchant = {
  name: string;
  url: string;
  iconSrc?: string; // /public/icons/flipkart.svg, /public/icons/amazon.svg ...
};

export default function BuyOnlineCard({ merchants = [] }: { merchants: Merchant[] }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-[22px] font-semibold leading-7 text-slate-900">
        <span className="text-[#F76B56]">Buy</span> this book Online
      </h3>

      <div className="mt-5 space-y-4">
        {merchants.map((m) => (
          <div key={m.name} className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative h-10 w-10 overflow-hidden rounded-lg ring-1 ring-slate-200/60 bg-white">
              {m.iconSrc ? (
                <Image src={m.iconSrc} alt={m.name} fill sizes="40px" className="object-contain" />
              ) : (
                <div className="grid h-full w-full place-items-center text-[11px] font-medium text-slate-500">
                  {m.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Link */}
            <Link
              href={m.url}
              target="_blank"
              className="text-[17px] underline underline-offset-4 text-slate-800 hover:text-slate-900"
            >
              Buy Now
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-slate-600">
        When you buy books using these links the Internet Archive may earn a{' '}
        <a href="#" className="underline underline-offset-2 hover:text-slate-800">
          small commission
        </a>
        .
      </p>
    </aside>
  );
}
