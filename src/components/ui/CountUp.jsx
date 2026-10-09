import { memo } from 'react';
// Render the final statistic without per-frame React updates.
function CountUp({ value, suffix = '', decimal = false, className = '' }) {
  return <span className={className}>{decimal ? value.toFixed(1) : Math.floor(value)}{suffix}</span>;
}
export default memo(CountUp);
