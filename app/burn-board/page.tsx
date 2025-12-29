"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";
import LeaderboardRow from "../../components/LeaderboardRow";
import SiteHead from "../../components/SiteHead";
import { useInView } from "react-intersection-observer";
import { useLeaderboardData } from "../../hooks/useLeaderboardData";

interface MainViewProps {
  data: LeaderboardData;
  filter: string;
}

function MainView({ data, filter }: MainViewProps) {
  const { ref, inView } = useInView();
  const [limit, setLimit] = useState(40);

  useEffect(() => {
    if (data.leaderboard && limit !== data.leaderboard.length) {
      if (inView) {
        setLimit((prevLimit) => {
          return prevLimit + 20;
        });
      }
    }
  }, [inView, data.leaderboard, limit]);

  if (!data || !data.leaderboard) {
    return null;
  }

  const burnColumnName =
    filter === "treatBox" ? "Boxes Burned" : "Flames Burned";

  const tableHeaders = ["Rank", "Address", burnColumnName, "Last Burn"];

  return (
    <div
      style={{
        display: "table",
        width: "100vw",
        marginTop: 40,
      }}
    >
      <div style={{ display: "table-header-group" }}>
        {tableHeaders.map((header, i) => {
          return (
            <div
              key={i}
              style={{
                display: "table-cell",
                paddingBottom: 20,
                whiteSpace: "nowrap",
                padding: 5,
              }}
            >
              {header}
            </div>
          );
        })}
      </div>
      {data.leaderboard.slice(0, limit).map((rowData, index) => (
        <React.Fragment key={index}>
          <LeaderboardRow data={rowData} rank={index + 1} />
          {index === limit - 5 && <div ref={ref}></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function BurnBoard() {
  const [filter, setFilter] = useState("flame");
  const { data, loading: dataLoading } = useLeaderboardData(filter);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTo) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [filter]);

  return (
    <div>
      {dataLoading || !data || !data.leaderboard ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <img
            alt="Tulip"
            src="/tulip.gif"
            style={{ height: "10vh", width: "10vh" }}
          />
        </div>
      ) : (
        <div className={styles.container}>
          <SiteHead name={"Burn Board"} />
          <h1>Forgotten Runes Wizard&apos;s Cult Burn Board</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            <img
              onClick={() => setFilter("flame")}
              style={{ cursor: "pointer" }}
              height={15}
              src="/icon_Flames.png"
              alt="Flame"
            />
            |
            <img
              onClick={() => setFilter("treatBox")}
              style={{ cursor: "pointer" }}
              height={15}
              src="/treat-box.png"
              alt="Treat Box"
            />
          </div>
          <div
            ref={scrollContainerRef}
            style={{
              height: "100vh",
              width: "95vw",
              overflow: "scroll",
              alignSelf: "center",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              maxWidth: 800,
            }}
          >
            <MainView data={data} filter={filter} />
          </div>
        </div>
      )}
      <footer
        style={{
          backgroundColor: "black",
          color: "white",
          fontFamily: "Alagard",
          margin: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <a
          href="https://twitter.com/thecodingadvent"
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: "10px" }}
        >
          by pedromcunha
        </a>
      </footer>
    </div>
  );
}

