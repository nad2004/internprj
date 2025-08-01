export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="w-full bg-white border-b border-gray-200 py-3 px-6 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        <span className="font-semibold text-lg text-black">Library Management System</span>
      </header>
      <main>{children}</main>
    </div>
  );
}
