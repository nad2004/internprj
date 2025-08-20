'use client';

import StatCard from '@/app/admin/dashboard/StatCard';
import DashboardUserCard from './DashBoardUserCard';

import Logo from '@/icons/Logo.svg';
import OverDueUserIcon from '@/icons/OverDueUserIcon.svg';
import BranchIcon from '@/icons/BranchIcon.svg';
import UserIcon from '@/icons/UserIcon.svg';
import BookIcon from '@/icons/BookIcon.svg';
import CardInfoList from './CardInfoList';
import { booksQueries } from '@/lib/api/book';
import { userQueries } from '@/lib/api/user';
import { loanQueries } from '@/lib/api/loan';

import { useQuery } from '@tanstack/react-query';
import {PieReturnBorrow} from './PieChart';

const admins = ['Nisal Gunasekara', 'Nisal Gunasekara', 'Nisal Gunasekara'];

const branches = ['Hà Đông'];

export default function Dashboard() {
  const { data, isError, isLoading, isRefetching, error } = useQuery({
    ...booksQueries.list(),
  });
  const total = data?.pagination?.total ?? 0;
  const { data: users = [], isError: userIsError, isLoading: userIsLoading } = useQuery(userQueries.all());
    const { data: loans = [], isLoading : loanIsError, isError : loanIsLoading } = useQuery({ ...loanQueries.all() });  
  const dashboardStats = [
    { label: 'Total User Base', value: users.length, icon: <UserIcon className="w-5 h-5" /> },
    { label: 'Total Book Count', value: total, icon: <BookIcon className="w-5 h-5" /> },
    { label: 'Branch Count', value: 1, icon: <BranchIcon className="w-5 h-5" /> },
  ];

  const userAdmins = users.filter((user) => user.role === 'admin');
  const totalBorrowedBooks = loans.filter((loan) => loan.status !== 'pending').length;
  const totalReturnedBooks = loans.filter((loan) => loan.status === 'returned').length;
 const overdueUsers = loans
   .filter((loan) => loan.status === 'overdue' && loan.userId && loan.userId.username)
   .map((loan) => loan.userId!.username)
   .filter((username): username is string => typeof username === 'string');

  if (isLoading || userIsLoading || loanIsLoading) {
    return <div>Loading...</div>;
  }

  if (isError || userIsError || loanIsError) {
    return <div>Error loading data</div>;
  }
  return (
    <div className="pt-6 ">
      <div className="grid grid-cols-4 gap-6 ">
        <div className=" pt-6 col-span-2 ">
          <div className="flex flex-col items-center gap-6">
            <PieReturnBorrow
        totalBorrowed={totalBorrowedBooks}
        totalReturned={totalReturnedBooks}
        className="w-3/4 aspect-square"
      />
            <div className="flex flex-row gap-4 bg-gray-100 p-4 rounded-lg shadow-sm w-fit">
              <div className="flex items-center justify-center">
                <Logo className='w-15 h-15'/>
              </div>
              <div className="w-px bg-gray-300 mx-2" />

              <div className="flex flex-col justify-center gap-4 text-base font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                  <span>Total Borrowed Books: {totalBorrowedBooks}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#F27851] rounded-full"></div>
                  <span>Total Returned Books: {totalReturnedBooks}</span>
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
            <h2 className="text-lg font-semibold mb-4"> Admins</h2>
            <ul className="space-y-3">
              {userAdmins.map((admin, i) => (
                <DashboardUserCard key={i} admin={admin} />
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-12">
          <CardInfoList
            title="Branch Network"
            items={branches}
            mainText="MyBook Shelf - Hà Nội"
            Icon={BranchIcon}
          />
          <CardInfoList
            title="Overdue Borrowers"
            items={overdueUsers || []}
            mainText="Sarith Gunasekara"
            Icon={OverDueUserIcon}
          />
        </div>
      </div>
    </div>
  );
}
