'use client';

import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import BookCard from './BookCard';
import type { Book } from '@/types/Books';

type Props = {
  books: Book[];
  autoplay?: boolean;
  autoplayDelay?: number;
  size?: 'sm' | 'md' | 'lg';
  itemBasisClass?: string;
  className?: string;
  showArrows?: boolean;
  containerClassName?: string; // NEW: áp vào thẻ Carousel (khung bo góc)
  contentClassName?: string; // NEW: áp vào CarouselContent
};

const SIZE_TO_BASIS: Record<NonNullable<Props['size']>, string> = {
  sm: 'basis-[140px] sm:basis-[150px] md:basis-[160px]',
  md: 'basis-[170px] sm:basis-[190px] md:basis-[200px]',
  lg: 'basis-[210px] sm:basis-[230px] md:basis-[250px]',
};

export default function BooksCarousel({
  books,
  autoplay = false,
  autoplayDelay = 3500,
  size = 'md',
  itemBasisClass,
  className = '',
  showArrows = true,
  containerClassName = '',
  contentClassName = '',
}: Props) {
  const autoplayRef = useRef(Autoplay({ delay: autoplayDelay, stopOnInteraction: true }));
  const itemBasis = itemBasisClass ?? SIZE_TO_BASIS[size];

  return (
    <div className={`relative ${className}`}>
      <Carousel
        opts={{ align: 'start', loop: false }}
        plugins={autoplay ? [autoplayRef.current] : []}
        className={` p-3 overflow-hidden ${containerClassName}`} // <-- overflow-hidden
      >
        <CarouselContent className={`-ml-3 ${contentClassName} space-x-8`}>
          {books.map((b) => (
            <CarouselItem key={b._id} className={`${itemBasis} pl-3 `}>
              <BookCard book={b} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {showArrows && (
          <>
            <CarouselPrevious className="left-1 border-slate-200 bg-white/90 hover:bg-white" />
            <CarouselNext className="right-1 border-slate-200 bg-white/90 hover:bg-white" />
          </>
        )}
      </Carousel>
    </div>
  );
}
