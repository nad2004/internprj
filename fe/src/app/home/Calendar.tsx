'use client';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-custom.css'; // Thêm dòng này

export default function CalendarUI() {
  const events: Record<string, { title: string; desc?: string; action?: string }> = {
    '2025-07-24': { title: 'Library Catalog', desc: 'Room 101\n3 PM' },
    '2025-07-26': { title: 'Book Review', desc: '10 AM, Online' },
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col min-h-[340px] w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-base">Your Library</div>
      </div>
      <Calendar
        calendarType="gregory"
        defaultActiveStartDate={new Date()}
        tileContent={({ date, view }) => {
          if (view === 'month') {
            const key = date.toISOString().slice(0, 10);
            const event = events[key];
            return (
              <>
                <span className="date-number">{date.getDate()}</span>
                {event && (
                  <div className="mt-5">
                    <div className="font-semibold leading-tight text-xs">{event.title}</div>
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
              </>
            );
          }
          return <span className="date-number">{date.getDate()}</span>;
        }}
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={false}
      />
    </div>
  );
}
