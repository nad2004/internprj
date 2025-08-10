import React from 'react';
import { Button } from '@/components/ui/button';
import PlusIcon from '@/icons/PlusIcon.svg';
import SearchNormalIcon from '@/icons/SearchNormalIcon.svg';
import SearchInput from '@/components/SearchInput';

interface BodyHeaderProps {
  title: string;
  addTitle: string;
  query: string;
  onQueryChange: (newQuery: string) => void;
  onAddClick: () => void;
  placeholder?: string;
}

export default function BodyHeader({
  title,
  addTitle,
  query,
  onQueryChange,
  onAddClick,
  placeholder = 'Search...',
}: BodyHeaderProps) {
  return (
    <div className="mb-6 flex justify-between space-x-4 w-full">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <div className="flex flex-row space-x-2 w-full max-w-md">
        <Button variant="default" className="h-full" onClick={onAddClick}>
          <PlusIcon className="text-white" />
          Add {addTitle}
        </Button>
        <div className="relative flex-grow">
          <SearchNormalIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
          <SearchInput
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-3 py-2 w-full border border-blue-500 rounded-md focus:outline-none focus:ring-1"
          />
        </div>
      </div>
    </div>
  );
}
