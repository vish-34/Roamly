export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(timeString) {
  if (!timeString) return '';
  // Handles HH:mm or full strings
  const [hours, minutes] = timeString.split(':');
  if (!hours) return timeString;
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHours = h % 12 || 12;
  return `${formattedHours}:${minutes || '00'} ${ampm}`;
}

export function getBudgetStatus(utilizationPercent) {
  if (utilizationPercent >= 100) {
    return {
      status: 'exceeded',
      label: 'Over Budget',
      bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
      barColor: 'bg-rose-500',
      pillColor: 'bg-rose-100 text-rose-800'
    };
  }
  if (utilizationPercent >= 80) {
    return {
      status: 'warning',
      label: 'Near Budget Limit',
      bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
      barColor: 'bg-amber-500',
      pillColor: 'bg-amber-100 text-amber-800'
    };
  }
  return {
    status: 'healthy',
    label: 'On Track',
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    barColor: 'bg-emerald-500',
    pillColor: 'bg-emerald-100 text-emerald-800'
  };
}
