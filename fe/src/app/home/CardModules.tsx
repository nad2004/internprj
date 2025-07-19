import Image from 'next/image';

export default function CardModules() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* Card 1 */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-row items-start">
        <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
          <Image
            src="/lib-catalog.jpg"
            alt="Library Catalog"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="ml-4 flex flex-col flex-1">
          <div className="font-bold text-base leading-tight">Library Catalog</div>
          <div className="text-xs mb-2">Search for your favorite books</div>
          <div className="text-xs">
            Available now, check status
            <br />
            120 books
          </div>
          <div className="flex justify-between mt-auto text-xs text-gray-600 pt-3">
            <span>Category 5/10</span>
            <span>45% checked out</span>
          </div>
        </div>
      </div>
      {/* Card 2 */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-row items-start">
        <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
          <Image
            src="/lib-borrow.jpg"
            alt="Book Borrowing"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="ml-4 flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base leading-tight">Book Borrowing</span>
            <span className="ml-auto bg-black text-white text-[10px] px-2 py-[2px] rounded font-semibold leading-none">
              Borrow
            </span>
          </div>
          <div className="text-xs mb-2">How to borrow books?</div>
          <div className="text-xs">
            Tuesday 10/12, 3 PM, Room 101
            <br />
            75 books
          </div>
          <div className="flex justify-between mt-auto text-xs text-gray-600 pt-3">
            <span>Category 3/10</span>
            <span>25% checked out</span>
          </div>
        </div>
      </div>
      {/* Card 3 */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-row items-start">
        <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
          <Image
            src="/lib-stats.jpg"
            alt="Borrowing Statistics"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="ml-4 flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base leading-tight">Borrowing Statistics</span>
            <span className="ml-auto bg-black text-white text-[10px] px-2 py-[2px] rounded font-semibold leading-none">
              Statistic
            </span>
          </div>
          <div className="text-xs mb-2">Current Trends</div>
          <div className="text-xs">
            Wednesday 12/12, 1 PM
            <br />
            Individual Borrowing History
          </div>
          <div className="flex justify-between mt-auto text-xs text-gray-600 pt-3">
            <span>Status</span>
            <span>Pending approval...</span>
          </div>
        </div>
      </div>
      {/* Card 4 */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-row items-start">
        <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
          <Image
            src="/lib-review.jpg"
            alt="Book Review"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="ml-4 flex flex-col flex-1">
          <span className="font-bold text-base leading-tight">Book Review</span>
          <div className="text-xs mb-2">Review with the librarian</div>
          <div className="text-xs">
            Monday 15/12, 10 AM
            <br />
            Individual meeting Online
          </div>
          <div className="flex justify-between mt-auto text-xs text-gray-600 pt-3">
            <span>Status</span>
            <span>Registered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
