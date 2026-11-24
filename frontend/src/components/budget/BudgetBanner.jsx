import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Wallet,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { formatCurrency, getBudgetStatus } from '../../utils/formatters';

export default function BudgetBanner({ trip }) {
  if (!trip) return null;

  const totalBudget = trip.budget?.totalBudget ?? trip.totalBudget ?? 0;
  const totalEstimated = trip.budget?.totalEstimated ?? trip.totalEstimatedExpenses ?? 0;
  const totalActual = trip.budget?.totalActual ?? trip.totalActualExpenses ?? 0;
  const remaining = trip.budget?.remainingBudget ?? (trip.remainingBudget !== undefined ? trip.remainingBudget : (totalBudget - totalActual));
  const utilization = trip.budget?.utilizationPercentage ?? trip.budgetUtilizationPercent ?? 0;
  const variance = trip.budget?.variance ?? (trip.spendingVariance || 0);
  const projectedRemaining = trip.budget?.projectedRemaining ?? (trip.projectedBudgetRemaining !== undefined 
    ? trip.projectedBudgetRemaining 
    : (totalBudget - totalEstimated));
  const isOverBudget = trip.budget?.isOverBudget ?? (trip.isOverBudget || (totalActual > totalBudget));

  const status = getBudgetStatus(utilization);

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm transition-all">
      
      {/* Top Row: Metric Badges & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Mandatory Vibe Check
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
              Server-Calculated
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 mt-0.5">
            Budget vs. Actual Tracker
          </h2>
        </div>

        {/* Dynamic Status Pill */}
        <div className={`self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold ${status.bgColor}`}>
          {isOverBudget ? (
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          )}
          <span>{isOverBudget ? 'Trip Over Budget!' : status.label}</span>
        </div>
      </div>

      {/* 4 Essential Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        
        {/* Total Budget */}
        <div className="bg-stone-50/80 rounded-2xl p-3.5 border border-stone-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-slate-400" /> Total Budget
          </span>
          <p className="font-display font-extrabold text-xl text-slate-900 mt-1">
            {formatCurrency(totalBudget, trip.currency)}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Trip Allocation</span>
        </div>

        {/* Total Actual Expenses */}
        <div className="bg-stone-50/80 rounded-2xl p-3.5 border border-stone-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Actual Spent
          </span>
          <p className={`font-display font-extrabold text-xl mt-1 ${isOverBudget ? 'text-rose-600' : 'text-slate-900'}`}>
            {formatCurrency(totalActual, trip.currency)}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Confirmed expenses</span>
        </div>

        {/* Remaining Budget */}
        <div className="bg-stone-50/80 rounded-2xl p-3.5 border border-stone-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Remaining
          </span>
          <p className={`font-display font-extrabold text-xl mt-1 ${remaining < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {formatCurrency(remaining, trip.currency)}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Unspent cash</span>
        </div>

        {/* Variance vs Estimated */}
        <div className="bg-stone-50/80 rounded-2xl p-3.5 border border-stone-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            {variance > 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            )}
            Est. Variance
          </span>
          <p className={`font-display font-extrabold text-xl mt-1 ${variance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {variance > 0 ? `+${formatCurrency(variance, trip.currency)}` : formatCurrency(variance, trip.currency)}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
            {variance > 0 ? 'Over estimate' : 'Under estimate'}
          </span>
        </div>

      </div>

      {/* Progress Bar & Utilization Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-slate-700">Budget Utilization</span>
            <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full ${status.pillColor}`}>
              {Math.round(utilization)}%
            </span>
          </div>
          <span className="text-slate-500">
            Projected Remaining: <strong className={projectedRemaining < 0 ? 'text-rose-600' : 'text-slate-800'}>{formatCurrency(projectedRemaining, trip.currency)}</strong>
          </span>
        </div>

        {/* Visual Progress Track */}
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/50">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${status.barColor}`}
            style={{ width: `${Math.min(Math.max(utilization, 0), 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>0%</span>
          <span>80% Warning Mark</span>
          <span>100% Target</span>
        </div>
      </div>

    </div>
  );
}
