const { calculateTripBudget } = require('./budgetService');

function sortActivities(activities = []) {
  return [...activities].sort((left, right) => {
    const leftKey = `${left.date}T${left.time}`;
    const rightKey = `${right.date}T${right.time}`;
    return leftKey.localeCompare(rightKey);
  });
}

function serializeTrip(trip) {
  const plainTrip = typeof trip.toObject === 'function' ? trip.toObject() : trip;
  const activities = sortActivities(plainTrip.activities);

  return {
    ...plainTrip,
    activities,
    budget: calculateTripBudget({ totalBudget: plainTrip.totalBudget, activities })
  };
}

module.exports = { serializeTrip, sortActivities };
