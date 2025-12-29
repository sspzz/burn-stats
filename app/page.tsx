"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Select from "react-dropdown-select";
import styled from "@emotion/styled";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SiteHead from "../components/SiteHead";
import { Wizard, TraitOption, Selection } from "@/types";
import { TraitStat } from "@/lib/types";
import { useBurnStats } from "../hooks/useBurnStats";
// @ts-ignore - JSON import
import wizziesData from "../data/wizzies.json";

const wizzies = wizziesData as Wizard;
const traitList = ["head", "body", "prop", "familiar", "rune", "background"] as const;

// Styled component wrapper for react-dropdown-select
const StyledSelectWrapper = styled('div')`
  .react-dropdown-select {
    background: #333;
    border: #333 !important;
    color: #fff;
    width: 10vw;

    @media only screen and (max-width: 600px) {
      width: 30vw;
    }

    .react-dropdown-select-clear,
    .react-dropdown-select-dropdown-handle {
      color: #fff;
    }
    .react-dropdown-select-option {
      border: 1px solid #fff;
    }
    .react-dropdown-select-item {
      color: #333;
    }
    .react-dropdown-select-input {
      color: #fff;
      font-family: Alagard;
      width: 6em;
    }
    .react-dropdown-select-dropdown {
      position: absolute;
      left: 0;
      border: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      border-radius: 2px;
      overflow: auto;
      z-index: 9;
      background: #333;
      box-shadow: none;
      color: #fff !important;
      width: 30vw;
    }
    .react-dropdown-select-item {
      color: #f2f2f2;
      border-bottom: 1px solid #333;

      :hover {
        color: #ffffff80;
      }
    }
    .react-dropdown-select-item.react-dropdown-select-item-selected,
    .react-dropdown-select-item.react-dropdown-select-item-active {
      border-bottom: 1px solid #333;
      color: #fff;
      font-weight: bold;
    }
    .react-dropdown-select-item.react-dropdown-select-item-disabled {
      background: #777;
      color: #ccc;
    }
  }
` as unknown as React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;

interface MainViewProps {
  order: string[];
  souls: { [tokenId: string]: { name: string } };
}

function MainView({ order, souls }: MainViewProps) {
  console.log("creating");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        alignItems: "center",
      }}
    >
      {order.map((token, index) => {
        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "5vh",
              justifyItems: "start",
            }}
          >
            <h2
              style={{
                alignSelf: "end",
                marginRight: "1vw",
                maxWidth: "16vw",
                fontSize: "1.5vh",
              }}
            >
              {order.length - index}.
            </h2>
            <div style={{ alignSelf: "self-start" }}>
              <a
                href={
                  "https://forgotten.market/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/" +
                  token
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoadImage
                  src={
                    "https://nftz.forgottenrunes.com/wizards/" + token + ".png"
                  }
                  style={{ width: "20vh", maxWidth: "30vw" }}
                />
              </a>
              <h3 style={{ fontSize: "1.2vh", maxWidth: "20vh" }}>
                {wizzies[token]?.name || ""}
              </h3>
            </div>
            <img
              src="/arrow.png"
              style={{
                width: "5vh",
                height: "1vh",
                margin: "1vh",
                maxWidth: "21vw",
              }}
              alt="arrow"
            />
            <div>
              <a
                href={
                  "https://forgotten.market/0x251b5f14a825c537ff788604ea1b58e49b70726f/" +
                  token
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoadImage
                  src={
                    "https://portal.forgottenrunes.com/api/souls/img/" + token
                  }
                  style={{ width: "20vh", maxWidth: "30vw" }}
                />
              </a>
              <h3 style={{ fontSize: "1.2vh", maxWidth: "20vh" }}>
                {souls[token]?.name || ""}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const { data, loading: dataLoading } = useBurnStats();
  const [filteredData, setFilteredData] = useState<{ order: string[] } | null>(null);
  const [selection, setSelection] = useState<Selection>({
    head: [],
    body: [],
    prop: [],
    familiar: [],
    rune: [],
    background: [],
  });

  // Initialize filteredData when data loads
  React.useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  function updateFilter(e: TraitOption[], type: string) {
    const currentSelection = { ...selection };
    (currentSelection as any)[type] = e;
    setSelection(currentSelection);

    if (!data) return;

    const newOrder: string[] = [];
    for (const wizId of data.order) {
      const match = {
        head: false,
        body: false,
        prop: false,
        familiar: false,
        rune: false,
        background: false,
      };

      for (const traitType of traitList) {
        const traitSelection = (currentSelection as any)[traitType] as TraitOption[];
        if (traitSelection.length === 0) {
          (match as any)[traitType] = true;
        } else {
          for (const x of traitSelection) {
            if (wizzies[wizId] && (wizzies[wizId] as any)[traitType] === x.name) {
              (match as any)[traitType] = true;
              break;
            }
          }
        }
      }
      if (
        match.head &&
        match.body &&
        match.prop &&
        match.familiar &&
        match.rune &&
        match.background
      ) {
        newOrder.push(wizId);
      }
    }

    setFilteredData({ order: newOrder });
  }

  return (
    <div>
      {dataLoading || !data || !filteredData ? (
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
      ) : (
        <div className={styles.container}>
          <SiteHead name={'Burn Log'}/>
          <h1>Forgotten Runes Wizard&apos;s Cult Burn Log</h1>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            {data.burned} wizards burned | {1112 - data.burned} flames remain |{" "}
            <Link href="/burn-board">
              <span style={{ cursor: "pointer" }}>Burn Board</span>
            </Link>
            |{" "}
            <Link href="/flame-shame">
              <img
                src="/Item-candle.png"
                height={16}
                style={{ cursor: "pointer" }}
                alt="Flame Shame"
              />
            </Link>
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1.5vh",
              maxWidth: "60vw",
              alignSelf: "center",
              flexWrap: "wrap",
            }}
          >
            {traitList.map((trait, index) => {
              const traitOptions = data.traits.filter(
                (x: TraitStat) => x.type === trait && x.name
              );
              const selectedValues = (selection as any)[trait] as TraitOption[];
              return (
                <StyledSelectWrapper key={index}>
                  <Select
                    placeholder={trait}
                    options={traitOptions}
                    values={selectedValues}
                    onChange={(e: TraitOption[]) => updateFilter(e, trait)}
                    multi={true}
                    searchable={true}
                    noDataLabel="No matches found"
                    labelField="name"
                    valueField="name"
                    closeOnSelect={true}
                  />
                </StyledSelectWrapper>
              );
            })}
          </div>
          <div
            style={{
              height: "100vh",
              width: "95vw",
              overflow: "scroll",
              overflowX: "hidden",
              alignSelf: "center",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              borderRadius: "1em",
            }}
          >
            <MainView order={filteredData.order} souls={data.souls} />
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

