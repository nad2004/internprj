import React from 'react';

interface Column<T> {
  key: keyof T | string; // key lấy dữ liệu trong item hoặc dùng cho custom render
  header: string; // tên header cột
  width?: string; // (tuỳ chọn) width cột, ví dụ '150px' hoặc '20%'
  render?: (item: T) => React.ReactNode; // hàm custom render ô cell
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  className?: string;
}

function GenericTable<T>({ data, columns, onEdit, onDelete, onView, className }: TableProps<T>) {
  return (
    <div
      className={`overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white ${className}`}
    >
      <table className="min-w-full table-fixed text-sm text-left text-gray-900">
        <thead>
          <tr className="border-b border-black">
            {columns.map((col) => (
              <th
                key={col.key.toString()}
                className="py-4 px-6 font-medium tracking-wide"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className={`  hover:bg-gray-50 cursor-pointer`}>
              {columns.map((col) => (
                <td key={col.key.toString()} className="py-4 px-6 font-medium truncate">
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GenericTable;
