const allowedHabitTypes = ['positive', 'negative'];

const allowedEntryStatuses = [
  'planned',
  'completed',
  'missed',
  'occurred',
];

function isValidHabit({ name, type, category }) {
  return (
    typeof name === 'string' &&
    name.trim().length > 0 &&
    allowedHabitTypes.includes(type) &&
    typeof category === 'string' &&
    category.trim().length > 0
  );
}

function isValidEntryStatus(status) {
  return allowedEntryStatuses.includes(status);
}

module.exports = {
  isValidHabit,
  isValidEntryStatus,
};