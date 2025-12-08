export const calculateAchievementPercent = (target, achievement) => {
  if (!target || !achievement) return '0.00';
  return ((parseFloat(achievement) / parseFloat(target)) * 100).toFixed(2);
};

export const calculateClosingStock = (opening, received, released, auction) => {
  const openingVal = parseFloat(opening) || 0;
  const receivedVal = parseFloat(received) || 0;
  const releasedVal = parseFloat(released) || 0;
  const auctionVal = parseFloat(auction) || 0;
  return (openingVal + receivedVal - releasedVal - auctionVal).toFixed(2);
};

export const getDPDSeverity = (dpd) => {
  const days = parseInt(dpd);
  if (isNaN(days)) return 'unknown';
  if (days <= 7) return 'low';
  if (days <= 30) return 'medium';
  return 'high';
};

export const getCurrentDateTime = () => {
  return new Date().toISOString();
};

export const formatDateForDisplay = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
