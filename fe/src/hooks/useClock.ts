'use client';
import { useEffect, useState } from 'react';

type Tick = 'second' | 'minute';

/** Đồng hồ realtime, trả về now + 2 label định dạng sẵn */
export function useClock(tick: Tick = 'minute') {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let t: number;

    const schedule = () => {
      const d = new Date();
      setNow(d);

      if (tick === 'minute') {
        // cập nhật đúng mốc phút để giảm re-render
        const ms = (60 - d.getSeconds()) * 1000 - d.getMilliseconds();
        t = window.setTimeout(schedule, Math.max(ms, 250));
      } else {
        t = window.setTimeout(schedule, 1000 - d.getMilliseconds());
      }
    };

    schedule();
    return () => clearTimeout(t);
  }, [tick]);

  const h12 = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  const timeLabel = `${String(h12).padStart(2, '0')}:${minutes} ${ampm}`;

  const MONTHS = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  const dateLabel = `${now.getDate()}-${MONTHS[now.getMonth()]}-${now.getFullYear()}`;

  return { now, timeLabel, dateLabel };
}
