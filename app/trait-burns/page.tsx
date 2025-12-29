"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import SiteHead from "../../components/SiteHead";
import { useBurnStats } from "../../hooks/useBurnStats";
import { TraitStat } from "@/lib/types";

type SortField = "name" | "old" | "new" | "diff" | "percentage";
type SortDirection = "asc" | "desc";

interface TraitStatWithPercentage extends TraitStat {
  burnPercentage: number;
}

export default function TraitBurns() {
  const { data, loading, error } = useBurnStats();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("diff");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const traitTypes = ["all", "head", "body", "prop", "familiar", "rune", "background"];

  // Process and enhance trait data
  const processedTraits = useMemo(() => {
    if (!data?.traits) return [];

    return data.traits
      .map((trait) => ({
        ...trait,
        burnPercentage: trait.old > 0 ? (trait.diff / trait.old) * 100 : 0,
      }))
      .filter((trait) => {
        // Filter by type
        if (selectedType !== "all" && trait.type !== selectedType) {
          return false;
        }
        // Filter by search query
        if (searchQuery && !trait.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        switch (sortField) {
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "old":
            aValue = a.old;
            bValue = b.old;
            break;
          case "new":
            aValue = a.new;
            bValue = b.new;
            break;
          case "diff":
            aValue = a.diff;
            bValue = b.diff;
            break;
          case "percentage":
            aValue = a.burnPercentage;
            bValue = b.burnPercentage;
            break;
          default:
            return 0;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortDirection === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });
  }, [data?.traits, selectedType, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortArrow = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>;
  };

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!data?.traits) return null;

    const totalTraits = data.traits.length;
    const totalBurned = data.traits.reduce((sum, t) => sum + t.diff, 0);
    const mostBurned = data.traits.reduce(
      (max, t) => (t.diff > max.diff ? t : max),
      data.traits[0]
    );
    const leastBurned = data.traits
      .filter((t) => t.old > 0)
      .reduce(
        (min, t) => (t.diff < min.diff ? t : min),
        data.traits.find((t) => t.old > 0) || data.traits[0]
      );

    return {
      totalTraits,
      totalBurned,
      mostBurned,
      leastBurned,
    };
  }, [data?.traits]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <img src="/tulip.gif" style={{ height: "10vh", width: "10vh" }} alt="Loading" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <SiteHead name="Trait Burns" />
        <h1>Error loading trait burn statistics</h1>
        <p>{error?.message || "Unknown error"}</p>
        <Link href="/">Go back home</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SiteHead name="Trait Burns" />
      <h1>Forgotten Runes Wizard&apos;s Cult Trait Burn Statistics</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          marginBottom: "2vh",
        }}
      >
        <Link href="/">
          <span style={{ cursor: "pointer" }}>Burn Log</span>
        </Link>
        |{" "}
        <Link href="/burn-board">
          <span style={{ cursor: "pointer" }}>Burn Board</span>
        </Link>
        |{" "}
        <Link href="/flame-shame">
          <span style={{ cursor: "pointer" }}>Flame Shame</span>
        </Link>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2vw",
            marginBottom: "2vh",
            flexWrap: "wrap",
            fontSize: "1.2vh",
          }}
        >
          <div>
            <strong>Total Traits:</strong> {summary.totalTraits}
          </div>
          <div>
            <strong>Total Burned:</strong> {summary.totalBurned}
          </div>
          <div>
            <strong>Most Burned:</strong> {summary.mostBurned.name} ({summary.mostBurned.diff})
          </div>
          <div>
            <strong>Least Burned:</strong> {summary.leastBurned.name} ({summary.leastBurned.diff})
          </div>
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1vw",
          marginBottom: "2vh",
          flexWrap: "wrap",
        }}
      >
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            background: "#333",
            color: "#fff",
            border: "1px solid #666",
            padding: "0.5vh 1vw",
            fontFamily: "Alagard",
            fontSize: "1.2vh",
            cursor: "pointer",
          }}
        >
          {traitTypes.map((type) => (
            <option key={type} value={type}>
              {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search trait name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: "#333",
            color: "#fff",
            border: "1px solid #666",
            padding: "0.5vh 1vw",
            fontFamily: "Alagard",
            fontSize: "1.2vh",
            minWidth: "200px",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          width: "95vw",
          maxWidth: "1200px",
          margin: "0 auto",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "1.2vh",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #666" }}>
              <th
                style={{
                  padding: "1vh",
                  textAlign: "left",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("name")}
              >
                Trait Name <SortArrow field="name" />
              </th>
              <th
                style={{
                  padding: "1vh",
                  textAlign: "left",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("old")}
              >
                Original <SortArrow field="old" />
              </th>
              <th
                style={{
                  padding: "1vh",
                  textAlign: "left",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("new")}
              >
                Remaining <SortArrow field="new" />
              </th>
              <th
                style={{
                  padding: "1vh",
                  textAlign: "left",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("diff")}
              >
                Burned <SortArrow field="diff" />
              </th>
              <th
                style={{
                  padding: "1vh",
                  textAlign: "left",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("percentage")}
              >
                Burn % <SortArrow field="percentage" />
              </th>
              <th style={{ padding: "1vh", textAlign: "left" }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {processedTraits.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "2vh", textAlign: "center" }}>
                  No traits found matching your filters.
                </td>
              </tr>
            ) : (
              processedTraits.map((trait, index) => (
                <tr
                  key={`${trait.type}-${trait.name}-${index}`}
                  style={{
                    borderBottom: "1px solid #333",
                    backgroundColor: index % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)",
                  }}
                >
                  <td style={{ padding: "1vh" }}>
                    <strong>{trait.name}</strong>
                  </td>
                  <td style={{ padding: "1vh" }}>{trait.old}</td>
                  <td style={{ padding: "1vh" }}>{trait.new}</td>
                  <td style={{ padding: "1vh", color: trait.diff > 0 ? "#ff6b6b" : "#fff" }}>
                    {trait.diff}
                  </td>
                  <td style={{ padding: "1vh" }}>
                    {trait.burnPercentage.toFixed(1)}%
                  </td>
                  <td style={{ padding: "1vh", textTransform: "capitalize" }}>
                    {trait.type}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "2vh", textAlign: "center", fontSize: "1vh" }}>
        Showing {processedTraits.length} of {data.traits.length} traits
      </div>

      <footer
        style={{
          backgroundColor: "black",
          color: "white",
          fontFamily: "Alagard",
          margin: "10px",
          display: "flex",
          justifyContent: "center",
          marginTop: "4vh",
        }}
      >
        <a
          href="https://twitter.com/tv3636"
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: "10px" }}
        >
          by tv
        </a>
      </footer>
    </div>
  );
}

