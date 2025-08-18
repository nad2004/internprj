'use client';
import Vector1 from '@/icons/Vector1.svg';
import Vector2 from '@/icons/Vector2.svg';
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>
        <div className="relative min-h-screen isolate bg-[#f6f6f7] text-slate-800">
          {/* Background vectors / gradient */}
          <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
            {/* Top-right gradient blob */}

            {/* Decorative waves (place Vector1.svg & Vector2.svg in /public) */}
            <Vector1 className="pointer-events-none select-none absolute top-0 left-0 w-full " />
            <Vector2 className="pointer-events-none select-none absolute w-full " />
          </div>

          {/* Centered card */}
          <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
