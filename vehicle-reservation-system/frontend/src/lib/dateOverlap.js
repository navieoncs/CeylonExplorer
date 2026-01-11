/**
 * Checks if two date ranges overlap.
 * Rule: newStart <= existingEnd AND newEnd >= existingStart
 * Dates are expected to be strings YYYY-MM-DD or comparable.
 */
export function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && aEnd >= bStart;
}
