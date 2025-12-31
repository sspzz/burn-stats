import { LazyLoadImage } from "react-lazy-load-image-component";
import { useEnsName } from "wagmi";
import { useInView } from "react-intersection-observer";
import { OwnerData } from "@/types";

function truncateAddress(address: string, shrinkIndicator?: string): string {
  return address.slice(0, 4) + (shrinkIndicator || "…") + address.slice(-4);
}

interface OwnerRowProps {
  tokens: OwnerData;
}

const OwnerRow = function ({ tokens }: OwnerRowProps) {
  const { ref, inView } = useInView();
  const { data: ensName } = useEnsName({
    address: tokens.owner as `0x${string}`,
    cacheTime: 60 * 60000,
    enabled: inView,
  });

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "2vh",
        justifyItems: "start",
      }}
    >
      <h2>
        <a
          href={`https://opensea.io/${tokens.owner}`}
          target="_blank"
          rel="noreferrer"
        >
          {ensName ? ensName : truncateAddress(tokens.owner)} |{" "}
          {tokens.flameCount} {tokens.flameCount === 1 ? "flame" : "flames"}
        </a>
      </h2>
      <div
        style={{
          display: "flex",
          overflowY: "auto",
          gap: 10,
          maxWidth: "95vw",
        }}
      >
        {tokens.tokens.map((token, index) => {
          return (
            <a
              key={index}
              href={
                "https://opensea.io/item/ethereum/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/item/" +
                token.tokenId
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                style={{
                  width: 200,
                  height: 300,
                  position: "relative",
                }}
              >
                <LazyLoadImage
                  src={`https://runes-turnarounds.s3.amazonaws.com/${token.tokenId}/${token.tokenId}.png`}
                  style={{
                    width: "100%",
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 6,
                  }}
                />
                <h3 style={{ fontSize: 20, padding: 20 }}>{token.name}</h3>
                <div
                  style={{
                    borderImageSource: "url(/newframe_black.png)",
                    borderImageSlice: "30 35",
                    borderImageWidth: "24px",
                    borderImageOutset: 0,
                    borderStyle: "solid",
                    borderImageRepeat: "round",
                    imageRendering: "pixelated",
                    height: "100%",
                    position: "absolute",
                    inset: 0,
                  }}
                ></div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default OwnerRow;

