import MaximizeCircle from '@/icons/MaximizeCircle.svg';
import SecurityUser from '@/icons/SecurityUser.svg';

const DashboardUserCard = ({ admin }) => {
  return (
    <>
      <li className="flex items-center justify-between bg-gray-50 p-2 rounded-md border">
        <div className="flex items-center gap-2">
          <SecurityUser />
          <div>
            <p className="text-base">{admin}</p>
            <p className="text-sm text-gray-500">Admin ID: {1}</p>
          </div>
        </div>
        <span className="text-green-600 text-sm font-medium">● Active</span>
        <MaximizeCircle />
      </li>
    </>
  );
};
export default DashboardUserCard;
