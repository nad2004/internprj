// components/home/QuoteCard.tsx
export default function QuoteCard({
  title = "Today's Quote",
  quote = "There is more treasure in books than in all the pirate's loot on Treasure Island.",
  author = 'Walt Disney',
}: {
  title?: string;
  quote?: string;
  author?: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 text-white shadow-sm
                    bg-gradient-to-br from-[#ff6b57] via-[#f05a84] to-[#7b4bd3]"
    >
      <p className="text-sm/6 font-semibold opacity-95">{title}</p>
      <p className="mt-3 text-base sm:text-lg leading-6 sm:leading-7 max-w-[34ch]">“{quote}”</p>
      <p className="mt-3 text-right text-xs sm:text-sm opacity-90">—{author}</p>

      {/* dots */}
      <div className="mt-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-white/90" />
        <span className="h-2 w-2 rounded-full bg-white/50" />
        <span className="h-2 w-2 rounded-full bg-white/50" />
      </div>
    </div>
  );
}
