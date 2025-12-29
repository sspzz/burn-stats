import { useEffect, useState } from "react";
import { LeaderboardData } from "@/types";

export function useLeaderboardData(filter: string = "flame") {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/leaderboard-data?filter=${filter}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard data: ${response.statusText}`);
        }
        
        const json = await response.json();
        setData(json);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filter]);

  return { data, loading, error };
}

