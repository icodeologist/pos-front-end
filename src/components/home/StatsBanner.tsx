// MOCK: replace with a real BE endpoint (e.g. GET /admin/stats)
// once one exists — ordersToday and revenueToday are placeholders.
const MOCK_STATS = {
  ordersToday: 0,
  revenueToday: 0,
};

export default function StatsBanner() {
  return (
    <div className="border-l-4 border-emerald-700 bg-white rounded-r-xl shadow-sm px-8 py-8">
      <p className="text-sm uppercase tracking-wide text-stone-400 mb-2">
        Today
      </p>
      <div className="flex gap-10">
        <div>
          <p className="text-3xl font-fraunces text-stone-800">
            {MOCK_STATS.ordersToday}
          </p>
          <p className="text-stone-500 text-sm">Orders served</p>
        </div>
        <div>
          <p className="text-3xl font-fraunces text-stone-800">
            ₹{MOCK_STATS.revenueToday.toFixed(2)}
          </p>
          <p className="text-stone-500 text-sm">Revenue</p>
        </div>
      </div>
    </div>
  );
}
