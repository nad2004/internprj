'use client';

import { Users, BookOpen, Building2, User, Settings } from 'lucide-react';
import StatCard from '@/app/admin/StatCard';
import Image from 'next/image';
const dashboardStats = [
  { label: 'Total User Base', value: '0150', icon: <Users className="w-5 h-5" /> },
  { label: 'Total Book Count', value: '01500', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Branch Count', value: '0010', icon: <Building2 className="w-5 h-5" /> },
];

const overdueBorrowers = [
  'Sarith Gunasekara',
  'Sarith Gunasekara',
  'Sarith Gunasekara',
  'Sarith Gunasekara',
];

const admins = ['Nisal Gunasekara', 'Nisal Gunasekara', 'Nisal Gunasekara'];

const branches = ['Branch #1', 'Branch #2', 'Branch #3'];

export default function Dashboard() {
  return (
    <div className="pt-6 ">
      <div className="grid grid-cols-4 gap-6 ">
        {/* Left: Pie chart + legend */}
        <div className=" pt-6 col-span-2 ">
          <div className="flex flex-col items-center gap-6">
            {/* Placeholder pie chart */}
            <div className="w-3/4  aspect-square bg-gradient-to-tr from-gray-900 to-gray-700 rounded-full relative">
              {/* Optional: Pie chart library can be inserted */}
            </div>
            {/* Legend */}
            <div className="flex flex-row gap-4 bg-gray-100 p-4 rounded-lg shadow-sm w-fit">
              {/* Left Icon */}
              <div className="flex items-center justify-center">
                <Image src="/your-icon.svg" alt="Legend Icon" width={100} height={100} />
              </div>

              {/* Vertical Divider */}
              <div className="w-px bg-gray-300 mx-2" />

              {/* Right Content */}
              <div className="flex flex-col justify-center gap-4 text-base font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                  <span>Total Borrowed Books</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-black rounded-full"></div>
                  <span>Total Returned Books</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 ">
          {/* Stats */}
          <div className="flex flex-col gap-4">
            {dashboardStats.map((stat, i) => (
              <StatCard key={i} icon={stat.icon} value={stat.value} label={stat.label} />
            ))}
          </div>
          {/* BookWorm Admins */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">BookWorm Admins</h2>
            <ul className="space-y-3">
              {admins.map((admin, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <div>
                      <p className="text-sm">{admin}</p>
                      <p className="text-xs text-gray-500">Admin ID: {i + 1}</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-xs font-medium">● Active</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {/* Branch Network */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Branch Network</h2>
            <ul className="space-y-3">
              {branches.map((branch, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <div>
                      <p className="text-sm">BookWorm - Matara</p>
                      <p className="text-xs text-gray-500">{branch}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Overdue Borrowers */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Overdue Borrowers</h2>
            <ul className="space-y-3">
              {overdueBorrowers.map((user, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <div>
                      <p className="text-sm">{user}</p>
                      <p className="text-xs text-gray-500">Borrowed ID: {i + 1}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
