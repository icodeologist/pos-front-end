import { useEffect, useState, type ReactNode } from "react";
import { getCreditSummary, type CreditSummary } from "../api/credit";

type LedgerStatus = "owing" | "settled";
type LedgerCustomer = {
  id: number;
  name: string;
  business?: string;
  phone: string;
  balance: number;
  lastVisit: string;
  notes: string;
  status: LedgerStatus;
};

const customers: LedgerCustomer[] = [
  { id: 1, name: "David Miller", business: "Spice Kitchen", phone: "9876543210", balance: 2450, lastVisit: "2026-09-02", notes: "Local restaurant owner. Settles credit bi-weekly on Mondays.", status: "owing" },
  { id: 2, name: "Marcus Cheng", business: "Diner 44", phone: "9845123456", balance: 850, lastVisit: "2026-09-04", notes: "Takes 3kg boneless and wings daily.", status: "owing" },
  { id: 3, name: "Elena Rodriguez", phone: "9712345678", balance: 420, lastVisit: "2026-08-30", notes: "Regular family buyer. Credit limit ₹1,000.", status: "owing" },
  { id: 5, name: "Vikram Singh", business: "Biryani Corner", phone: "9123456789", balance: 3180, lastVisit: "2026-08-28", notes: "High volume buyer. Credit overdue by more than 7 days.", status: "owing" },
  { id: 7, name: "Aarav Traders", phone: "9988776655", balance: 0, lastVisit: "2026-09-01", notes: "Account settled.", status: "settled" },
  { id: 8, name: "Meera Nair", phone: "9876501234", balance: 0, lastVisit: "2026-08-27", notes: "Account settled.", status: "settled" },
];

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(value);

function Icon({ children, className = "h-4 w-4" }: { children: ReactNode; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>;
}

export default function CreditSystem() {
  const [filter, setFilter] = useState<"owing" | "all" | "settled">("owing");
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState<CreditSummary | null>(null);
  const [summaryError, setSummaryError] = useState("");
  useEffect(() => {
    getCreditSummary()
      .then(setSummary)
      .catch(() => setSummaryError("Could not load credit totals from the backend."));
  }, []);
  const owing = customers.filter(customer => customer.balance > 0);
  const settled = customers.filter(customer => customer.balance === 0);
  const healthTone = summary?.settlement_health === "At risk" ? "text-red-600" : summary?.settlement_health === "Watch" ? "text-amber-600" : "text-emerald-600";
  const visibleCustomers = customers.filter(customer => {
    const matchesFilter = filter === "all" || customer.status === filter;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${customer.name} ${customer.business ?? ""} ${customer.phone}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return <div className="min-h-screen bg-slate-100 text-slate-900">
    <header className="flex min-h-[76px] items-center border-b border-slate-200 bg-white px-5 sm:px-8">
      <div><h1 className="text-xl font-extrabold tracking-tight">Credit System &amp; Udhaar Ledger</h1><p className="mt-1 text-xs font-medium text-slate-400">{new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(new Date())}</p></div>
      <div className="ml-auto hidden items-center gap-3 sm:flex"><span className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">₹&nbsp; INR</span><span className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">{summaryError ? "Sync unavailable" : summary ? "Live database totals" : "Syncing…"}</span></div>
    </header>
    <main className="p-4 sm:p-6 lg:p-8">
      {summaryError&&<div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">{summaryError}</div>}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total outstanding udhaar</p><p className="mt-4 font-mono text-3xl font-extrabold text-orange-500">{summary ? money(summary.total_credit) : "—"}</p><p className="mt-2 text-xs text-slate-400">Current balance across all customers</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-500"><Icon><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 10h10M7 14h7"/></Icon></span></div></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Pending collections</p><p className="mt-4 font-mono text-3xl font-extrabold">{summary?.pending_collections ?? "—"}</p><p className="mt-2 text-xs text-slate-400">Customers owing more than ₹0.01</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-500"><Icon><path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></Icon></span></div></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Settlement health</p><p className={`mt-4 text-3xl font-extrabold ${healthTone}`}>{summary?.settlement_health ?? "—"}</p><p className="mt-2 text-xs text-slate-400">{summary ? `${summary.pending_customer_percentage.toFixed(1)}% of ${summary.total_customers} customers currently owe` : "Based on the share of customers owing"}</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-500"><Icon><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></Icon></span></div></article>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><h2 className="text-lg font-extrabold">Customer Credit Ledger</h2><p className="mt-1 text-xs text-slate-400">Track and settle shop credit balances</p></div><div className="flex rounded-xl bg-slate-100 p-1">{([['owing',`Owing Udhaar (${owing.length})`],['all',`All Accounts (${customers.length})`],['settled',`Settled (${settled.length})`]] as const).map(([value,label])=><button key={value} onClick={()=>setFilter(value)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-bold transition ${filter===value?"bg-white text-orange-600 shadow-sm":"text-slate-500"}`}>{label}</button>)}</div></div>
        <label className="relative block border-b border-slate-100"><Icon className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></Icon><input value={search} onChange={event=>setSearch(event.target.value)} className="w-full px-14 py-4 text-sm outline-none placeholder:text-slate-400" placeholder="Search by customer name or 10-digit phone number..."/></label>
        <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left"><thead><tr className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{["Customer","Contact phone","Outstanding balance","Last visit","Notes / agreement","Actions"].map(heading=><th key={heading} className="px-6 py-4 last:text-right">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visibleCustomers.map(customer=><tr key={customer.id} className="hover:bg-slate-50"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">{customer.name[0]}</span><div><p className="text-sm font-bold">{customer.name}{customer.business&&` (${customer.business})`}</p><p className="mt-1 text-[10px] text-slate-400">ID #{customer.id}</p></div></div></td><td className="px-6 py-4 font-mono text-xs text-slate-500">{customer.phone}</td><td className={`px-6 py-4 font-mono text-sm font-extrabold ${customer.balance?"text-orange-500":"text-emerald-600"}`}>{money(customer.balance)}{customer.balance>=2000&&<span className="ml-2 rounded bg-red-50 px-1.5 py-1 font-sans text-[9px] text-red-500">High</span>}</td><td className="px-6 py-4 text-xs text-slate-500">{customer.lastVisit}</td><td className="max-w-sm px-6 py-4 text-xs text-slate-500">{customer.notes}</td><td className="px-6 py-4"><div className="flex justify-end gap-2"><button disabled title="Backend reminder endpoint not connected yet" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60">Remind</button><button disabled title="Backend settlement endpoint not connected yet" className="rounded-lg bg-orange-500 px-3 py-2 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">Collect Payment</button></div></td></tr>)}</tbody></table>{!visibleCustomers.length&&<p className="p-8 text-center text-sm text-slate-400">No customer accounts match this view.</p>}</div>
      </section>
    </main>
  </div>;
}
