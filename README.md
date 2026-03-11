# Lumière

Watch together with friends. Create private screening rooms, sync playback frame perfect, and enjoy voice chat, reactions, and a collaborative queue, all in real time.

![Lumière hero page](docs/hero.png)

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, TypeScript (tsx)

## Prerequisites

- Node.js 18+
- npm

## Project structure

```
Lumière/
├── frontend/       # Next.js app
│   └── src/
│       ├── app/          # Pages, layout, styles
│       └── components/    # CustomCursor, FilmStrip, Icons
├── backend/        # Node.js API
├── docs/          # Screenshots, assets
└── README.md
```

## Getting started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at [http://localhost:3000](http://localhost:3000).

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs at `http://localhost:3001` (set via `PORT` env var).

## Scripts

| Command        | Frontend                    | Backend          |
|---------------|-----------------------------|------------------|
| `npm run dev` | Start dev server (Turbopack) | Start with tsx watch |
| `npm run build` | Production build           | Compile TypeScript |
| `npm run start` | Start production server   | Run compiled JS   |
| `npm run lint` | ESLint (frontend only)      | n/a              |

## License

MIT
