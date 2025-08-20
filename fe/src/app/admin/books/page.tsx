'use client';
import BookOverviewPage from './(BookOverview)/BookOverview';
import BookInstancePage from './(BookInstance)/BookInstance';
import { useState } from 'react';

export default function BorrowingHistoryPage() {
  const [activeTab, setActiveTab] = useState<'book' | 'bookinstance'>('book');

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex border-b text-sm mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'book' ? 'border-b-2 border-gray-600 text-black' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('book')}
        >
          Book
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'bookinstance' ? 'border-b-2 border-gray-600 text-black' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('bookinstance')}
        >
          Book Instance
        </button>
      </div>

      {activeTab === 'book' && (
        <>
          <BookOverviewPage />
        </>
      )}
      {activeTab === 'bookinstance' && (
        <>
          <BookInstancePage />
        </>
      )}
    </div>
  );
}
