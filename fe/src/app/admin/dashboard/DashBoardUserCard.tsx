import SecurityUser from '@/icons/SecurityUser.svg';
import type { User } from '@/types/User';
const DashboardUserCard = ({ admin }: { admin: User }) => {
  return (
    <>
      <li className="flex items-center justify-between bg-gray-50 p-2 rounded-md border">
        <div className="flex items-center gap-2 mx-2">
          <SecurityUser />
          <div>
            <p className="text-base">{admin.username}</p>
            <p className="text-sm text-gray-500">{admin.email}</p>
          </div>
        </div>
        <span className="text-green-600 text-sm font-medium">{admin.status}</span>
      </li>
    </>
  );
};
export default DashboardUserCard;
