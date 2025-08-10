import React from 'react';

interface InfoListProps {
  title: string;
  items: string[];
  mainText: string;
  Icon: React.ElementType;
}

const CardInfoList: React.FC<InfoListProps> = ({ title, items, mainText, Icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-1/2">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ul className="space-y-3">
        {items.map((desc, i) => (
          <li key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded border">
            <Icon className=" w-6 h-6" />
            <div>
              <p className="text-sm font-medium">{mainText}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardInfoList;
