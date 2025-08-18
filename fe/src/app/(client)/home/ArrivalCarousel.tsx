'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import type { Book } from '@/types/Books';

type Props = {
  books: Book[];
  label?: string;
  autoplay?: boolean;
  delay?: number;
};

export default function ArrivalCarousel({
  books,
  label = 'New Arrivals',
  autoplay = true,
  delay = 2000,
}: Props) {
  // Giữ 1 instance plugin và CHO PHÉP reset sau tương tác
  const plugin = useRef(
    Autoplay({
      delay,
      stopOnInteraction: false, // đừng dừng hẳn
      stopOnMouseEnter: true, // chỉ tạm dừng khi hover
    }),
  );

  return (
    <div className="relative self-start w-1/2 rounded-2xl border-[1.5px] border-[#E9D7FB] bg-white shadow-sm">
      {/* Label dọc */}
      <div className="pointer-events-none absolute inset-y-0 z-10 w-10 sm:w-12">
        <div className="relative h-full w-full rounded-l-2xl rounded-r-md bg-gradient-to-b from-[#f9361c] to-[#681df3] shadow">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 origin-center whitespace-nowrap text-center text-white font-medium leading-none tracking-wide text-[clamp(16px,2vw,20px)]">
            {label}
          </span>
        </div>
      </div>

      {/* Khung carousel – thêm handlers để pause/resume */}
      <Carousel
        opts={{ align: 'start', loop: true }}
        plugins={autoplay ? [plugin.current] : []}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="p-3 pl-14 overflow-hidden"
      >
        <CarouselContent className="-ml-3">
          {books.map((b) => {
            const src =
              b.imageLinks?.thumbnail ||
              b.imageLinks?.smallThumbnail ||
              '/images/placeholder-book.png';
            return (
              <CarouselItem key={b._id} className="basis-1/5 pl-3">
                <div className="mx-auto w-[130px] sm:w-[140px] md:w-[150px] rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                  <div
                    className="relative overflow-hidden rounded-lg"
                    style={{ aspectRatio: '3 / 4' }}
                  >
                    <Image src={src} alt={b.title} fill className="object-cover" />
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
