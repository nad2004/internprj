export default function Calendar() {
  const events: Record<number, { title: string; desc?: string; action?: string }> = {
    4: { title: 'Library Catalog', desc: 'Room 101\n3 PM' },
    10: { title: 'Book Borrowing', desc: 'Room 202\n1 PM', action: 'Borrow' },
    15: { title: 'Borrowing Statistics', desc: '1 PM, Online', action: 'View' },
    19: { title: 'Book Review', desc: '10 AM, Online' },
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col min-h-[340px]">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-base">Your Library</div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="inline-flex items-center gap-1">
            <span className="font-medium">📅</span> December 01 - December 31
          </span>
        </div>
      </div>
      <div className="grid grid-cols-7 text-left text-xs font-semibold pb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="px-1 py-1 text-gray-500">
            {day}
          </div>
        ))}
      </div>
      {/* LƯU Ý: gap-0, chỉ dùng border cho từng cell */}
      <div className="grid grid-cols-7 gap-0 text-xs flex-1 border border-gray-200 rounded-lg overflow-hidden">
        {[...Array(31)].map((_, i) => {
          const day = i + 1;
          const event = events[day];
          return (
            <div
              key={day}
              className="border border-gray-200 min-h-[74px] relative px-2 pt-1 bg-white"
            >
              {/* Số ngày góc trên trái */}
              <div className="absolute left-2 top-1 text-[11px] text-gray-700 font-medium">
                {day}
              </div>
              {event && (
                <div className="mt-5">
                  <div className="font-semibold leading-tight">{event.title}</div>
                  {event.desc && (
                    <div className="text-xs text-gray-500 leading-tight whitespace-pre-line">
                      {event.desc}
                    </div>
                  )}
                  {event.action && (
                    <div className="inline-block mt-1 bg-black text-white px-2 py-[2px] rounded text-xs font-medium">
                      {event.action}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
