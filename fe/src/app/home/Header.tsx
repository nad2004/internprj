import { FaMessage } from 'react-icons/fa6';
import Input from '@/components/SearchInput';
import BookLogo from '@/components/BookLogo';
export default function Header() {
  return (
    <>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Library Dashboard</h1>
        <BookLogo />
      </div>
      <div className="flex items-center gap-3">
        <Input
          // value={search}
          // onChange={e => setSearch(e.target.value)}
          placeholder="Search for books..."
          // className="w-full" // Thêm className riêng nếu muốn
        />
        <span>
          <FaMessage />
        </span>
      </div>
    </>
  );
}
