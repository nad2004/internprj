import Image from 'next/image';
import type { Book, Category } from '@/types/Books';

type TrendingBookCardProps = {
  book: Book;
};

export default function TrendingBookCard({ book }: TrendingBookCardProps) {
  const categoryLabel =
    book.categories && book.categories.length > 0
      ? book.categories.map((c: Category) => c.name).join(' - ')
      : '—';

  return (
    <div className="bg-white  shadow p-4 flex flex-row items-start">
      <div className=" overflow-hidden flex-shrink-0 h-[195px] w-[160px]">
        <Image
          src={book.imageLinks?.thumbnail || '/placeholder.png'}
          alt={book.title}
          width={100}
          height={100}
          className="object-fill h-full w-full"
        />
      </div>
      <div className="ml-4 flex flex-col h-full flex-1 min-w-0">
        {/* Thông tin chính */}
        <div>
          <div className="font-bold text-base leading-tight">{book.title}</div>
          <div className="text-sm mb-2 text-gray-500">Search for your favorite books</div>
          <div className="text-base">
            <span className="text-gray-600">Author: </span>
            {(book.authors && book.authors[0]) || 'Unknown Author'}
          </div>
          <div>
            <span className="text-sm text-gray-500">Date: </span>
            <span className="text-sm font-semibold">{book.publishedDate || 'Unknown Date'}</span>
          </div>
          <div className="text-base uppercase font-bold text-emerald-700 tracking-wider drop-shadow-sm mt-2">
            {book.status && book.status}
          </div>
        </div>
        {/* Dòng dưới cùng */}
        <div className="flex justify-between text-base text-gray-600 pt-3 mt-auto">
          <span>{categoryLabel}</span>
          <button className="px-4 py-1 h-8 mb-2 bg-black text-white text-xs font-medium shadow hover:bg-gray-600">
            Borrow
          </button>
        </div>
      </div>
    </div>
  );
}
