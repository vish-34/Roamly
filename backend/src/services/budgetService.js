function asAmount(value) {
  return Number.isFinite(value) ? value : 0;
}

function calculateTripBudget({ totalBudget, activities = [] }) {
  const budget = asAmount(totalBudget);
  let totalEstimated = 0;
  let totalActual = 0;
  let recordedEstimated = 0;
  let unrecordedEstimated = 0;
  let unrecordedActualCount = 0;

  for (const activity of activities) {
    const estimate = asAmount(activity.estimatedCost);
    totalEstimated += estimate;

    if (activity.actualCost === null || activity.actualCost === undefined) {
      unrecordedEstimated += estimate;
      unrecordedActualCount += 1;
    } else {
      totalActual += asAmount(activity.actualCost);
      recordedEstimated += estimate;
    }
  }

  const remainingBudget = budget - totalActual;
  const projectedRemaining = budget - (totalActual + unrecordedEstimated);
  const utilizationPercentage = budget > 0 ? (totalActual / budget) * 100 : totalActual > 0 ? 100 : 0;
  const variance = totalActual - recordedEstimated;

  return {
    totalBudget: budget,
    totalEstimated,
    totalActual,
    recordedEstimated,
    unrecordedEstimated,
    unrecordedActualCount,
    remainingBudget,
    projectedRemaining,
    utilizationPercentage,
    variance,
    isOverBudget: totalActual > budget || projectedRemaining < 0,
    status: utilizationPercentage > 100 ? 'critical' : utilizationPercentage >= 80 ? 'warning' : 'safe'
  };
}

module.exports = { calculateTripBudget };
