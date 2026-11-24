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
    destinationCards: activities.map((activity) => ({
      id: activity._id,
      name: activity.name,
      address: activity.address,
      location: activity.location,
      providerRating: activity.rating,
      userRating: activity.userRating,
      displayRating: activity.rating ?? activity.userRating,
      notes: activity.notes,
      googlePlaceId: activity.googlePlaceId
    })),
    budget: calculateTripBudget({ totalBudget: plainTrip.totalBudget, activities })
  };
}

module.exports = { serializeTrip, sortActivities };
