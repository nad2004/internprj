import Image from 'next/image';
import { FaHistory, FaBookOpen, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

export default function RightSidebar() {
  return (
    <aside className="w-80 h-full flex flex-col space-y-6 bg-transparent">
      {/* Notifications */}
      <div className="font-bold text-xl mt-1">Notifications</div>
      <div className="bg-white rounded-xl shadow p-4 flex items-start justify-between">
        <div>
          <div className="font-semibold text-[15px]">
            Your book reservation was <span className="text-black font-bold">successful!</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            For assistance, please contact the librarian.
          </div>
        </div>
        <button className="ml-4 w-10 h-10 rounded-md bg-black flex items-center justify-center">
          <FaArrowRight className="text-white text-base" />
        </button>
      </div>
      <div className="font-bold text-xl">Current Loans</div>
      {/* Current Loans */}
      <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col space-y-4">
        <div className="w-full h-[110px] mb-2 relative rounded overflow-hidden flex-1">
          <Image
            src="/library-cover.jpg"
            alt="Book Cover"
            fill
            className="object-cover rounded"
            sizes="220px"
          />
        </div>
        {/* Thông tin sách */}
        <div className="flex items-center justify-between mb-1 py-2">
          <div className="font-semibold text-base">Book Title: Science</div>
          <div className="text-sm text-gray-400 font-medium">(Due in: 2 days)</div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-start flex-col">
            <div className="text-gray-600">Currently borrowed by:</div>
            <div className="text-gray-600">Status:</div>
          </div>

          <div className="flex flex-col items-end">
            <div className="font-semibold text-black">
              <span className="align-middle">✔</span> 5/10
            </div>
            <span className="text-sm font-semibold text-green-600 ">On Loan</span>
          </div>
        </div>
      </div>
      <div className="font-bold text-xl">Loan History</div>
      {/* Loan History */}
      <div className="bg-white rounded-xl shadow p-4 space-y-3 flex-1">
        {/* 1 */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center gap-3 p-2">
            {/* Icon vuông nền đen */}
            <span className="w-10 h-10 flex items-center justify-center rounded-md bg-black text-white text-xl">
              <FaHistory />
            </span>
            <div>
              <div className="font-semibold text-[15px]">Last Borrowed: Art</div>
              <div className="text-xs text-gray-600">Return Date: Next Week</div>
            </div>
          </div>
          {/* Badge tròn */}
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white border shadow text-base font-semibold">
            3
          </span>
        </div>
        {/* 2 */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center gap-3 p-2">
            <span className="w-10 h-10 flex items-center justify-center rounded-md bg-black text-white text-xl">
              <FaBookOpen />
            </span>
            <div>
              <div className="font-semibold text-[15px]">Current Borrowing:</div>
              <div className="text-xs text-gray-600">Return Date: Tomorrow</div>
            </div>
          </div>
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white border shadow text-base font-semibold">
            1
          </span>
        </div>
        {/* 3 */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center gap-3 p-2">
            <span className="w-10 h-10 flex items-center justify-center rounded-md bg-black text-white text-xl">
              <FaCalendarAlt />
            </span>
            <div>
              <div className="font-semibold text-[15px]">Next Due: 5</div>
              <div className="text-xs text-gray-600">Return Date: Next Month</div>
            </div>
          </div>
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white border shadow text-base font-semibold">
            2
          </span>
        </div>
      </div>
    </aside>
  );
}
