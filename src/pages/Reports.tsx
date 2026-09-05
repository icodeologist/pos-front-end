type Metric = { label: string; value: string; detail: string; color: string };
const metrics: Metric[] = [
  { label: "Gross billed", value: "₹2,810.00", detail: "5 total orders recorded", color: "text-slate-900" },
  { label: "Cash collected", value: "₹580.00", detail: "2 cash tickets", color: "text-emerald-600" },
  { label: "UPI / online", value: "₹420.00", detail: "1 QR transaction", color: "text-blue-600" },
  { label: "Credit (udhaar) given", value: "₹1,810.00", detail: "Outstanding: ₹6,900.00", color: "text-orange-500" },
];
const sellers = [
  ["Chicken Breast (Boneless Fillet)", "3 kg", "₹960.00", 34],
  ["Whole Broiler Chicken (Skin-off)", "4.5 kg", "₹810.00", 29],
  ["Crispy Chicken Wings", "2 kg", "₹420.00", 15],
  ["Chicken Liver & Gizzard (Kaleji)", "2.5 kg", "₹400.00", 14],
  ["Chicken Curry Cut (Mixed Pieces)", "1 kg", "₹220.00", 8],
] as const;

export default function Reports() {
  return <div className="min-h-screen bg-slate-100 text-slate-900">
    <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8"><h1 className="text-xl font-extrabold tracking-tight">Sales &amp; Credit Reports</h1><p className="mt-1 text-xs font-medium text-slate-400">{new Intl.DateTimeFormat("en-IN",{dateStyle:"full"}).format(new Date())}</p></header>
    <main className="p-4 sm:p-6 lg:p-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-extrabold">Poultry Shop Performance &amp; Ledger Report</h2><p className="mt-1 text-xs text-slate-400">Current summary of store sales, collection channels, and outstanding customer credit.</p></section>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(metric=><article key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{metric.label}</p><p className={`mt-3 font-mono text-2xl font-extrabold ${metric.color}`}>{metric.value}</p><p className="mt-2 text-xs text-slate-400">{metric.detail}</p></article>)}</section>
      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-extrabold">Top Selling Poultry Cuts</h2><div className="mt-5 space-y-5">{sellers.map((seller,index)=><div key={seller[0]}><div className="mb-2 flex items-center justify-between gap-4 text-xs font-bold"><span>{index+1}. {seller[0]}</span><span className="whitespace-nowrap font-mono">{seller[1]} · {seller[2]}</span></div><div className="h-2 rounded-full bg-slate-100"><div style={{width:`${seller[3]}%`}} className="h-full rounded-full bg-orange-500"/></div></div>)}</div></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-extrabold">Credit Khata Health &amp; Insights</h2><p className="mt-2 text-xs text-slate-400">Keep customer credit visible to protect working capital.</p><div className="mt-6 space-y-4"><div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4"><div><p className="text-xs font-extrabold text-amber-800">Total Active Ledger Debt</p><p className="mt-1 text-[11px] text-amber-700">Pending from 4 customers</p></div><strong className="font-mono text-lg text-amber-800">₹6,900.00</strong></div><div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div><p className="text-xs font-extrabold text-emerald-800">Immediate Cash Flow</p><p className="mt-1 text-[11px] text-emerald-700">Instant settlement (Cash + UPI)</p></div><strong className="font-mono text-lg text-emerald-800">₹1,000.00</strong></div></div><p className="mt-6 border-t border-slate-100 pt-5 text-[11px] text-slate-400">Backend report integration will replace these preview values when its reporting endpoints are available.</p></article>
      </section>
    </main>
  </div>;
}
