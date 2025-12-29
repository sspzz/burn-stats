import { useEffect, useState } from "react";
import { BurnData } from "@/types";

export function useBurnStats() {
  const [data, setData] = useState<BurnData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/burn-stats");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch burn stats: ${response.statusText}`);
        }
        
        const json = await response.json();
        setData(json);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        console.error("Error fetching burn stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { data, loading, error };
}

