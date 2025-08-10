import { ReactNode } from 'react';

type StatCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
};

export default function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex items-center bg-white rounded-md shadow-sm p-4 gap-4 border">
      {/* Icon section */}
      <div className="bg-gray-200 rounded-md p-3 flex items-center justify-center">
        <div className=" flex items-center justify-center w-6 h-6 text-black">{icon}</div>
      </div>

      {/* Divider */}
      <div className="h-full w-px bg-black" />

      {/* Text content */}
      <div>
        <p className="text-4xl font-extrabold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}
