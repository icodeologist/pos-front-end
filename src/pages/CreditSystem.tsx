import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCreditLedger, getCreditSummary, type CreditLedgerCustomer, type CreditSummary } from "../api/credit";

type LedgerFilter = "owing" | "all" | "settled";

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(value);
const purchaseDate = (value: string | null) => value
  ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value))
  : "No purchases yet";

function Icon({ children, className = "h-4 w-4" }: { children: ReactNode; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{children}</svg>;
}

export default function CreditSystem() {
  const [filter, setFilter] = useState<LedgerFilter>("owing");
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState<CreditSummary | null>(null);
  const [customers, setCustomers] = useState<CreditLedgerCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCreditData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [summaryData, ledgerData] = await Promise.all([getCreditSummary(), getCreditLedger()]);
      setSummary(summaryData);
      setCustomers(ledgerData);
    } catch {
      setError("Could not load the customer credit ledger from the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([getCreditSummary(), getCreditLedger()])
      .then(([summaryData, ledgerData]) => {
        setSummary(summaryData);
        setCustomers(ledgerData);
      })
      .catch(() => setError("Could not load the customer credit ledger from the backend."))
      .finally(() => setLoading(false));
  }, []);

  const owingCount = customers.filter((customer) => customer.balance > 0.01).length;
  const settledCount = customers.length - owingCount;
  const healthTone = summary?.settlement_health === "At risk" ? "text-red-600" : summary?.settlement_health === "Watch" ? "text-amber-600" : "text-emerald-600";
  const visibleCustomers = useMemo(() => customers.filter((customer) => {
    const isOwing = customer.balance > 0.01;
    const matchesFilter = filter === "all" || (filter === "owing" ? isOwing : !isOwing);
    const query = search.trim().toLowerCase();
    return matchesFilter && (!query || `${customer.name} ${customer.phone_number}`.toLowerCase().includes(query));
  }), [customers, filter, search]);

  return <div className="min-h-screen bg-slate-100 text-slate-900">
    <header className="flex min-h-[76px] items-center border-b border-slate-200 bg-white px-5 sm:px-8">
      <div><h1 className="text-xl font-extrabold tracking-tight">Customer Credit Ledger</h1><p className="mt-1 text-xs font-medium text-slate-400">{new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(new Date())}</p></div>
      <div className="ml-auto hidden items-center gap-3 sm:flex"><span className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">₹&nbsp; INR</span><span className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">{loading ? "Syncing…" : error ? "Sync unavailable" : "Live customer data"}</span></div>
    </header>
    <main className="p-4 sm:p-6 lg:p-8">
      {error && <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600"><span>{error}</span><button onClick={() => void loadCreditData()} className="whitespace-nowrap rounded-lg bg-red-100 px-3 py-2 text-xs font-bold">Try again</button></div>}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total outstanding credit</p><p className="mt-4 font-mono text-3xl font-extrabold text-orange-500">{summary ? money(summary.total_credit) : "—"}</p><p className="mt-2 text-xs text-slate-400">Current balance across all customers</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-500"><Icon><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 10h10M7 14h7"/></Icon></span></div></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Customers with balance</p><p className="mt-4 font-mono text-3xl font-extrabold">{summary?.pending_collections ?? "—"}</p><p className="mt-2 text-xs text-slate-400">Customers owing more than ₹0.01</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-500"><Icon><path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></Icon></span></div></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Settlement health</p><p className={`mt-4 text-3xl font-extrabold ${healthTone}`}>{summary?.settlement_health ?? "—"}</p><p className="mt-2 text-xs text-slate-400">{summary ? `${summary.pending_customer_percentage.toFixed(1)}% of ${summary.total_customers} customers currently owe` : "Based on real customer balances"}</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-500"><Icon><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></Icon></span></div></article>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><h2 className="text-lg font-extrabold">Customer accounts</h2><p className="mt-1 text-xs text-slate-400">Balances and latest purchases from the live database</p></div><div className="flex overflow-x-auto rounded-xl bg-slate-100 p-1">{([["owing", `Owing (${owingCount})`], ["all", `All (${customers.length})`], ["settled", `Settled (${settledCount})`]] as const).map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-bold transition ${filter === value ? "bg-white text-orange-600 shadow-sm" : "text-slate-500"}`}>{label}</button>)}</div></div>
        <label className="relative block border-b border-slate-100"><Icon className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></Icon><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full px-14 py-4 text-sm outline-none placeholder:text-slate-400" placeholder="Search by customer name or phone number..."/></label>
        {loading ? <p className="p-10 text-center text-sm text-slate-400">Loading customer accounts…</p> : <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{["Customer", "Contact phone", "Outstanding balance", "Last purchase"].map((heading) => <th key={heading} className="px-6 py-4">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visibleCustomers.map((customer) => <tr key={customer.id} className="hover:bg-slate-50"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">{customer.name.charAt(0).toUpperCase()}</span><div><p className="text-sm font-bold">{customer.name}</p><p className="mt-1 text-[10px] text-slate-400">ID #{customer.id}</p></div></div></td><td className="px-6 py-4 font-mono text-xs text-slate-500">{customer.phone_number}</td><td className={`px-6 py-4 font-mono text-sm font-extrabold ${customer.balance > 0.01 ? "text-orange-500" : "text-emerald-600"}`}>{money(customer.balance)}{customer.balance >= 2000 && <span className="ml-2 rounded bg-red-50 px-1.5 py-1 font-sans text-[9px] text-red-500">High</span>}</td><td className="px-6 py-4 text-xs font-semibold text-slate-500">{purchaseDate(customer.last_purchase)}</td></tr>)}</tbody></table>{!visibleCustomers.length && <p className="p-8 text-center text-sm text-slate-400">No customer accounts match this view.</p>}</div>}
      </section>
    </main>
  </div>;
}
