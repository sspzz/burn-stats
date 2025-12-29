# Forgotten Runes Wizard's Cult Burn Stats

A Next.js application for tracking and displaying burn statistics for Forgotten Runes Wizards and Souls.

## Features

- **Burn Log**: View all burned wizards with filtering by traits (head, body, prop, familiar, rune, background)
- **Burn Board**: Leaderboard showing top burners of flames and treat boxes
- **Flame Shame**: Display owners who hold both wizards and flames

## Tech Stack

- **Framework**: Next.js 13.5.6 (App Router)
- **Language**: TypeScript
- **Styling**: Emotion (styled-components), CSS Modules
- **Web3**: Wagmi, Ethers.js
- **Data**: Supabase
- **UI Components**: React Dropdown Select, Lazy Load Image

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Environment variables (see below)

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Alchemy API (for NFT data)
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
ALCHEMY_API_KEY=your_alchemy_api_key

# Supabase (for leaderboard data)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key

# Reservoir API (Deprecated, Reservoir no longer works)
NEXT_PUBLIC_RESERVOIR_API_KEY=your_reservoir_api_key
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
# or
yarn build
```

### Production

```bash
npm start
# or
yarn start
```

## Project Structure

```
burn-stats/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (Route Handlers)
│   │   ├── burn-stats/
│   │   ├── leaderboard-data/
│   │   ├── shame-data/
│   │   └── ...
│   ├── burn-board/         # Burn board page
│   ├── flame-shame/        # Flame shame page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── LeaderboardRow.tsx
│   ├── OwnerRow.tsx
│   ├── SiteHead.tsx
│   └── WagmiProvider.tsx
├── hooks/                  # Custom React hooks
│   ├── useBurnStats.ts
│   ├── useLeaderboardData.ts
│   ├── useShameData.ts
│   └── useTimeSince.ts
├── lib/                    # Utility libraries
│   ├── alchemy.ts         # Alchemy NFT API client
│   ├── stats.ts           # Stats calculation logic
│   └── types.ts           # TypeScript types
├── types/                  # Additional TypeScript types
│   └── index.ts
├── styles/                 # CSS files
│   ├── globals.css
│   └── Home.module.css
└── public/                 # Static assets
```

## Key Features

### Custom Hooks

- `useBurnStats()` - Fetches burn statistics data
- `useLeaderboardData(filter)` - Fetches leaderboard data with filter support
- `useShameData()` - Fetches flame shame data
- `useTimeSince(timestamp)` - Formats timestamps as relative time

### API Routes

All API routes are located in `app/api/` and use Next.js Route Handlers:

- `/api/burn-stats` - Main burn statistics
- `/api/leaderboard-data` - Leaderboard data (supports `?filter=flame` or `?filter=treatBox`)
- `/api/shame-data` - Flame shame data
- `/api/leaderboard-job` - Background job to update leaderboard
- `/api/shame-data-job` - Background job to update shame data

## Development Notes

- The project uses **App Router** 
- All components are written in **TypeScript**
- Client components are marked with `"use client"` directive
- The project uses `legacy-peer-deps` for npm due to some dependency conflicts

## Dependencies

### Core
- `next` - Next.js framework
- `react` & `react-dom` - React library
- `typescript` - TypeScript compiler

### Web3
- `wagmi` - React Hooks for Ethereum
- `ethers` - Ethereum library

### UI & Styling
- `@emotion/react` & `@emotion/styled` - CSS-in-JS
- `react-dropdown-select` - Dropdown component
- `react-lazy-load-image-component` - Lazy loading images
- `react-intersection-observer` - Intersection observer hooks

### Data & Utilities
- `@supabase/supabase-js` - Supabase client
- `dayjs` - Date manipulation
- `csv-parse` - CSV parsing

## License

Private project

## Contributors

- by tv ([@tv3636](https://twitter.com/tv3636))
- by pedromcunha ([@thecodingadvent](https://twitter.com/thecodingadvent))
