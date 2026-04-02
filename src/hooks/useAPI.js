import { useState, useEffect } from 'react';

/**
 * Generic data-fetching hook.
 * @param {Function} apiFn - API function that returns a promise (e.g. plansAPI.getAll)
 * @param {*} fallback - Fallback data to use if API fails
 * @param {Array} deps - Dependencies to re-fetch on change
 */
export default function useAPI(apiFn, fallback = [], deps = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    apiFn()
      .then((res) => {
        if (!cancelled) {
          setData(res.data?.data ?? fallback);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn('API fetch failed, using fallback:', err.message);
          setData(fallback);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
