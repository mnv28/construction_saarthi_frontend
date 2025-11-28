/**
 * useDebounce
 * Simple, reusable debounce hook used across the app.
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in ms (default: 500)
 * @returns {any} - Debounced value
 */

import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
