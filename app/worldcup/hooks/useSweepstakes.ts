import { useCallback, useEffect, useState } from "react";
import type { SweepstakesResponse } from "../lib/types";

const POLL_MS = 5 * 60 * 1000;

export function useSweepstakes() {
  const [data, setData] = useState<SweepstakesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/worldcup/api/sweepstakes");
      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }
      const json = (await response.json()) as SweepstakesResponse;
      setData(json);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load sweepstakes",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // State updates happen asynchronously after the fetch resolves, not during
    // the effect's synchronous pass; the lint rule can't see across the await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    const timer = setInterval(fetchData, POLL_MS);
    return () => clearInterval(timer);
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}
