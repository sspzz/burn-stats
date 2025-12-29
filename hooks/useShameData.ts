import { useEffect, useState } from "react";
import { ShameData } from "@/types";

export function useShameData() {
  const [data, setData] = useState<ShameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/shame-data");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch shame data: ${response.statusText}`);
        }
        
        const json = await response.json();
        setData(json);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        console.error("Error fetching shame data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { data, loading, error };
}

