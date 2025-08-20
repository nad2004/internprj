import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type Tone = "sky" | "green" | "amber" | "rose";

const toneMap: Record<Tone, { bg: string; bar: string }> = {
  sky:   { bg: "from-sky-500 to-sky-600",   bar: "bg-sky-700/40" },
  green: { bg: "from-emerald-500 to-emerald-600", bar: "bg-emerald-700/40" },
  amber: { bg: "from-amber-500 to-amber-600", bar: "bg-amber-700/40" },
  rose:  { bg: "from-rose-500 to-rose-600",  bar: "bg-rose-700/40" },
};

type StatCardProps = {
  icon: ReactNode;         // icon nhỏ góc trái
  value: number | string;
  label: string;
  tone?: Tone;             // màu của card
  href?: string;           // nếu muốn click "More info"
};

export default function StatCard({ icon, value, label, tone = "sky", href }: StatCardProps) {
  const t = toneMap[tone];

  return (
    <div className={`relative overflow-hidden rounded-md border shadow-sm bg-gradient-to-b ${t.bg} text-white`}>
      {/* watermark icon lớn mờ */}
      <div className="pointer-events-none absolute right-2 top-2 opacity-20 text-white/70 [&>svg]:w-24 [&>svg]:h-24">
        {icon}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/15 rounded-md p-2">{icon}</div>
          <div className="h-6 w-px bg-white/30" />
          <div>
            <p className="text-4xl font-extrabold leading-none drop-shadow-sm">{value}</p>
            <p className="text-sm/5 opacity-90">{label}</p>
          </div>
        </div>
      </div>

      <a
        href={href || "#"}
        className={`block ${t.bar} text-white/95 text-sm px-4 py-2 flex items-center justify-between`}
      >
        <span>More info</span>
        <ChevronRight className="w-4 h-4" />
      </a>
    </div>
  );
}
