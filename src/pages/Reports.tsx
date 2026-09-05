import { useCallback, useEffect, useMemo, useState } from "react";
import { getSalesReport, type SalesReport } from "../api/reports";

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(value);
const number = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
const timingColors = ["#f97316", "#3b82f6", "#8b5cf6", "#334155"];

export default function Reports() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setReport(await getSalesReport());
    } catch {
      setError("Could not load sales reports from the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSalesReport().then(setReport).catch(() => setError("Could not load sales reports from the backend.")).finally(() => setLoading(false));
  }, []);

  const totalTimedOrders = report?.customer_timing.reduce((sum, period) => sum + period.orders, 0) ?? 0;
  const peakPeriod = report?.customer_timing.reduce((peak, period) => period.orders > peak.orders ? period : peak, report.customer_timing[0]);
  const quietPeriod = report?.customer_timing.reduce((quiet, period) => period.orders < quiet.orders ? period : quiet, report.customer_timing[0]);
  const pieBackground = useMemo(() => {
    if (!report || totalTimedOrders === 0) return "conic-gradient(#e2e8f0 0 100%)";
    let cursor = 0;
    const segments = report.customer_timing.map((period, index) => {
      const start = cursor;
      cursor += period.orders / totalTimedOrders * 100;
      return `${timingColors[index]} ${start}% ${cursor}%`;
    });
    return `conic-gradient(${segments.join(", ")})`;
  }, [report, totalTimedOrders]);

  const metrics = report ? [
    { label: "Gross billed", value: money(report.gross_billed), detail: `${report.total_orders} orders recorded`, color: "text-slate-900" },
    { label: "Total orders", value: number(report.total_orders), detail: "All recorded purchases", color: "text-blue-600" },
    { label: "Items sold", value: number(report.items_sold), detail: "Combined item quantity", color: "text-violet-600" },
    { label: "Average order", value: money(report.average_order_value), detail: "Average billed per order", color: "text-orange-500" },
  ] : [];
  const highestProductQuantity = Math.max(...(report?.top_products.map((product) => product.quantity) ?? []), 1);

  return <div className="min-h-screen bg-slate-100 text-slate-900">
    <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8"><h1 className="text-xl font-extrabold tracking-tight">Sales Reports</h1><p className="mt-1 text-xs font-medium text-slate-400">{new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(new Date())}</p></header>
    <main className="p-4 sm:p-6 lg:p-8">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center"><div><h2 className="text-xl font-extrabold">Store performance</h2><p className="mt-1 text-xs text-slate-400">Live totals calculated from orders, payments, and sold items.</p></div><span className="self-start rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">{loading ? "Syncing…" : error ? "Sync unavailable" : "Live database report"}</span></section>
      {error && <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600"><span>{error}</span><button onClick={() => void loadReport()} className="whitespace-nowrap rounded-lg bg-red-100 px-3 py-2 text-xs font-bold">Try again</button></div>}

      {loading ? <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">Loading report…</div> : report && <>
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <article key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{metric.label}</p><p className={`mt-3 font-mono text-2xl font-extrabold ${metric.color}`}>{metric.value}</p><p className="mt-2 text-xs text-slate-400">{metric.detail}</p></article>)}</section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div><h2 className="text-lg font-extrabold">Top-selling products</h2><p className="mt-1 text-xs text-slate-400">Ranked by actual quantity sold</p></div><div className="mt-6 space-y-5">{report.top_products.map((product, index) => <div key={product.id}><div className="mb-2 flex items-center justify-between gap-4 text-xs font-bold"><span className="truncate">{index + 1}. {product.title}</span><span className="whitespace-nowrap font-mono">{number(product.quantity)} · {money(product.revenue)}</span></div><div className="h-2 rounded-full bg-slate-100"><div style={{ width: `${product.quantity / highestProductQuantity * 100}%` }} className="h-full rounded-full bg-orange-500"/></div></div>)}{!report.top_products.length && <p className="py-8 text-center text-sm text-slate-400">No sold products yet.</p>}</div></article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div><h2 className="text-lg font-extrabold">Customer visit timing</h2><p className="mt-1 text-xs text-slate-400">When purchases are busiest and quietest</p></div><div className="mt-7 grid items-center gap-8 sm:grid-cols-[190px_1fr]"><div className="relative mx-auto h-44 w-44 rounded-full" style={{ background: pieBackground }}><div className="absolute inset-8 grid place-items-center rounded-full bg-white text-center"><div><p className="font-mono text-2xl font-extrabold">{totalTimedOrders}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visits</p></div></div></div><div className="space-y-3">{report.customer_timing.map((period, index) => <div key={period.period} className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: timingColors[index] }}/><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{period.label}</p><p className="text-[10px] text-slate-400">{totalTimedOrders ? (period.orders / totalTimedOrders * 100).toFixed(1) : "0.0"}% of visits</p></div><span className="font-mono text-sm font-bold">{period.orders}</span></div>)}</div></div><div className="mt-7 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5"><div className="rounded-xl bg-orange-50 p-4"><p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-500">Peak period</p><p className="mt-1 text-sm font-bold text-orange-800">{peakPeriod?.label ?? "No data"}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Quiet period</p><p className="mt-1 text-sm font-bold text-slate-700">{quietPeriod?.label ?? "No data"}</p></div></div></article>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-6"><h2 className="text-lg font-extrabold">Payment channels</h2><p className="mt-1 text-xs text-slate-400">Net collected amounts grouped by recorded payment method</p></div><div className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">{report.payment_channels.map((channel) => <div key={channel.method} className="bg-white p-6"><p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{channel.method}</p><p className="mt-2 font-mono text-xl font-extrabold text-emerald-600">{money(channel.amount)}</p></div>)}{!report.payment_channels.length && <p className="col-span-full bg-white p-8 text-center text-sm text-slate-400">No payments recorded yet.</p>}</div></section>
      </>}
    </main>
  </div>;
}
