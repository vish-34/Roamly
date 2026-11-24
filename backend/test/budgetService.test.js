const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateTripBudget } = require('../src/services/budgetService');
const { sortActivities } = require('../src/services/tripService');

test('budget keeps zero actual cost distinct from an unrecorded cost', () => {
  const result = calculateTripBudget({
    totalBudget: 100,
    activities: [
      { estimatedCost: 40, actualCost: 50 },
      { estimatedCost: 30, actualCost: null },
      { estimatedCost: 10, actualCost: 0 }
    ]
  });

  assert.deepEqual(result, {
    totalBudget: 100, totalEstimated: 80, totalActual: 50, recordedEstimated: 50,
    unrecordedEstimated: 30, unrecordedActualCount: 1, remainingBudget: 50,
    projectedRemaining: 20, utilizationPercentage: 50, variance: 0,
    isOverBudget: false, status: 'safe'
  });
});

test('activities are sorted on date then time without mutating the source', () => {
  const activities = [
    { date: '2026-12-02', time: '09:00' },
    { date: '2026-12-01', time: '18:00' },
    { date: '2026-12-01', time: '09:00' }
  ];
  const sorted = sortActivities(activities);
  assert.deepEqual(sorted.map(({ date, time }) => `${date}T${time}`), ['2026-12-01T09:00', '2026-12-01T18:00', '2026-12-02T09:00']);
  assert.equal(activities[0].date, '2026-12-02');
});
