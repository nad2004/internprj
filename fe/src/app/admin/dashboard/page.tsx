'use client';

import StatCard from '@/app/admin/dashboard/StatCard';
import DashboardUserCard from './DashBoardUserCard';

import BookWormIcon from '@/icons/BookWormIcons.svg';
import OverDueUserIcon from '@/icons/OverDueUserIcon.svg';
import BranchIcon from '@/icons/BranchIcon.svg';
import UserIcon from '@/icons/UserIcon.svg';
import BookIcon from '@/icons/BookIcon.svg';
import CardInfoList from './CardInfoList';
import { booksQueries } from '@/lib/api/book';
import { useQuery } from '@tanstack/react-query';

const overdueBorrowers = [
  'Sarith Gunasekara',
  'Sarith Gunasekara',
  'Sarith Gunasekara',
  'Sarith Gunasekara',
];

const admins = ['Nisal Gunasekara', 'Nisal Gunasekara', 'Nisal Gunasekara'];

const branches = ['Branch #1', 'Branch #2', 'Branch #3'];

export default function Dashboard() {
  const { data, isError, isLoading, isRefetching, error } = useQuery({
    ...booksQueries.list(),
  });
  const total = data?.pagination?.total ?? 0;
  const dashboardStats = [
    { label: 'Total User Base', value: '0150', icon: <UserIcon className="w-5 h-5" /> },
    { label: 'Total Book Count', value: total, icon: <BookIcon className="w-5 h-5" /> },
    { label: 'Branch Count', value: '0010', icon: <BranchIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="pt-6 ">
      <div className="grid grid-cols-4 gap-6 ">
        <div className=" pt-6 col-span-2 ">
          <div className="flex flex-col items-center gap-6">
            <div className="w-3/4  aspect-square bg-gradient-to-tr from-gray-900 to-gray-700 rounded-full relative"></div>
            <div className="flex flex-row gap-4 bg-gray-100 p-4 rounded-lg shadow-sm w-fit">
              <div className="flex items-center justify-center">
                <BookWormIcon />
              </div>
              <div className="w-px bg-gray-300 mx-2" />

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

        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4 h-1/2">
            {dashboardStats.map((stat, i) => (
              <StatCard key={i} icon={stat.icon} value={stat.value} label={stat.label} />
            ))}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm h-1/2">
            <h2 className="text-lg font-semibold mb-4">BookWorm Admins</h2>
            <ul className="space-y-3">
              {admins.map((admin, i) => (
                <DashboardUserCard key={i} admin={admin} />
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-12">
          <CardInfoList
            title="Branch Network"
            items={branches}
            mainText="BookWorm - Matara"
            Icon={BranchIcon}
          />
          <CardInfoList
            title="Overdue Borrowers"
            items={overdueBorrowers}
            mainText="Sarith Gunasekara"
            Icon={OverDueUserIcon}
          />
        </div>
      </div>
    </div>
  );
}
