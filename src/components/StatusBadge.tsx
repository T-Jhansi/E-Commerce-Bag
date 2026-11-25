import { TicketStatus } from "@/lib/types";

const STYLES: Record<TicketStatus, string> = {
  Received:
    "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  "In Service":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "Ready for Pickup":
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Returned:
    "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  Cancelled:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
