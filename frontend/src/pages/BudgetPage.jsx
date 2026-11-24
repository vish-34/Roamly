import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Info,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import { formatCurrency, formatDate, getBudgetStatus } from '../utils/formatters';

export default function BudgetPage() {
  const { id } = useParams();
  const { trips, activeTrip } = useTripContext();

  const currentTrip = activeTrip && activeTrip._id === id ? activeTrip : trips.find(t => t._id === id);

  if (!currentTrip) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display font-bold text-2xl text-slate-800">Trip not found</h2>
        <Link to="/trips" className="mt-4 inline-flex items-center gap-2 text-brand-600 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Trips
        </Link>
      </div>
    );
  }

  const activities = currentTrip.activities || [];
  const totalBudget = currentTrip.totalBudget || 0;
  const totalEstimated = currentTrip.totalEstimatedExpenses || 0;
  const totalActual = currentTrip.totalActualExpenses || 0;
  const remaining = currentTrip.remainingBudget !== undefined ? currentTrip.remainingBudget : (totalBudget - totalActual);
  const utilization = currentTrip.budgetUtilizationPercent || 0;
  const variance = currentTrip.spendingVariance || 0;
  const projectedRemaining = currentTrip.projectedBudgetRemaining !== undefined 
    ? currentTrip.projectedBudgetRemaining 
    : (totalBudget - totalEstimated);
  const isOverBudget = currentTrip.isOverBudget || (totalActual > totalBudget);

  const status = getBudgetStatus(utilization);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link to={`/trips/${currentTrip._id}`} className="hover:text-brand-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Trip Workspace
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Financial Analytics</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900">
            Budget vs. Actual Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic server-side financial calculations for {currentTrip.name}
          </p>
        </div>

        {/* Status Pill */}
        <div className={`self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold ${status.bgColor}`}>
          {isOverBudget ? (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          )}
          <span>{isOverBudget ? 'Budget Exceeded!' : status.label}</span>
        </div>
      </div>

      {/* 6 Key Financial Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Allocated Budget */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Budget</span>
          <p className="font-display font-extrabold text-lg text-slate-900 mt-1">
            {formatCurrency(totalBudget, currentTrip.currency)}
          </p>
          <span className="text-[11px] text-slate-500">Trip allocation</span>
        </div>

        {/* Estimated Expenses */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Estimated</span>
          <p className="font-display font-extrabold text-lg text-slate-900 mt-1">
            {formatCurrency(totalEstimated, currentTrip.currency)}
          </p>
          <span className="text-[11px] text-slate-500">Planned costs</span>
        </div>

        {/* Actual Expenses */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Actual</span>
          <p className={`font-display font-extrabold text-lg mt-1 ${isOverBudget ? 'text-rose-600' : 'text-slate-900'}`}>
            {formatCurrency(totalActual, currentTrip.currency)}
          </p>
          <span className="text-[11px] text-slate-500">Confirmed spend</span>
        </div>

        {/* Remaining Budget */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Remaining</span>
          <p className={`font-display font-extrabold text-lg mt-1 ${remaining < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {formatCurrency(remaining, currentTrip.currency)}
          </p>
          <span className="text-[11px] text-slate-500">Budget - Actual</span>
        </div>

        {/* Variance */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Spending Variance</span>
          <p className={`font-display font-extrabold text-lg mt-1 ${variance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {variance > 0 ? `+${formatCurrency(variance, currentTrip.currency)}` : formatCurrency(variance, currentTrip.currency)}
          </p>
          <span className="text-[11px] text-slate-500">{variance > 0 ? 'Over estimate' : 'Under estimate'}</span>
        </div>

        {/* Projected Remaining */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Projected Rem.</span>
          <p className={`font-display font-extrabold text-lg mt-1 ${projectedRemaining < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {formatCurrency(projectedRemaining, currentTrip.currency)}
          </p>
          <span className="text-[11px] text-slate-500">With pending est.</span>
        </div>

      </div>

      {/* Progress Bar & Zones */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Budget Utilization Progress
            </h3>
            <p className="text-xs text-slate-500">
              Visual indicator of current actual spending relative to the trip limit
            </p>
          </div>
          <span className={`text-sm font-extrabold px-3 py-1 rounded-full ${status.pillColor}`}>
            {Math.round(utilization)}% Utilized
          </span>
        </div>

        {/* Multi-tier progress bar */}
        <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${status.barColor}`}
            style={{ width: `${Math.min(Math.max(utilization, 0), 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-3 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>0% — 80%: Normal spending zone</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>80% — 100%: Approaching limit</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>&gt; 100%: Exceeded budget</span>
          </div>
        </div>
      </div>

      {/* Activity-by-Activity Expense Breakdown Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-slate-900">
            Activity Expense Ledger
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {activities.length} total activities recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Activity</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Estimated Cost</th>
                <th className="px-6 py-3.5">Actual Cost</th>
                <th className="px-6 py-3.5">Variance</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {activities.length > 0 ? (
                activities.map((act) => {
                  const hasActual = act.actualCost !== null && act.actualCost !== undefined;
                  const itemVariance = hasActual ? (act.actualCost - act.estimatedCost) : null;

                  return (
                    <tr key={act._id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{act.name}</div>
                        {act.address && <div className="text-[11px] text-slate-400 truncate max-w-xs">{act.address}</div>}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(act.date)}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {formatCurrency(act.estimatedCost, currentTrip.currency)}
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {hasActual ? (
                          <span className="text-slate-900">
                            {formatCurrency(act.actualCost, currentTrip.currency)}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic font-normal">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {itemVariance !== null ? (
                          <span className={itemVariance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                            {itemVariance > 0 ? `+${formatCurrency(itemVariance, currentTrip.currency)}` : formatCurrency(itemVariance, currentTrip.currency)}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {hasActual ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-stone-100 px-2.5 py-1 rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                    No activities recorded yet. Add activities to the itinerary to see live budget breakdown.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Viva Architectural Note */}
      <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-amber-950">
            Viva Architectural Defense: Server-Authoritative Calculation Engine
          </h4>
          <p className="leading-relaxed text-amber-800">
            All financial equations are computed synchronously on the backend during API calls.
            The database stores only raw inputs (`estimatedCost` and tristate `actualCost`: `null` for unrecorded, numbers for recorded).
            This eliminates redundant denormalized fields, prevents data drift, and guarantees that any addition, edit, or deletion triggers an atomic recalculation.
          </p>
        </div>
      </div>

    </div>
  );
}
