# RBook for Redis

This repository runs Stephen Grider's **RBook**, a notebook-style application for writing notes and executing Redis commands.

- npm package: https://www.npmjs.com/package/rbook
- Hosted version: https://rbook.cloud/
- Local URL: http://localhost:3050

## Requirements

- Node.js: https://nodejs.org/en/download/
- pnpm (recommended) or npm

Install pnpm if needed:

```powershell
npm install --global pnpm
```

## Project layout

```text
.
|-- package.json
|-- pnpm-lock.yaml
|-- Readme.md
`-- notebooks\
    `-- *.json
```

Dependencies are installed at the project root. RBook notebook files are kept separately in `notebooks`.

## Install

After cloning the repository, open a terminal in its root directory and use one package manager.

With pnpm (recommended):

```powershell
pnpm install
```

Alternatively, with npm:

```powershell
npm install
```

## Start RBook

From the project root, run:

```powershell
pnpm start
```

Or, if you installed with npm:

```powershell
npm start
```

Then open http://localhost:3050. Keep the terminal open while using RBook, and press `Ctrl+C` to stop the server.

## Dark theme

This project applies a custom dark theme to RBook automatically:

- `pnpm install` or `npm install` applies it after installing dependencies.
- `pnpm start` or `npm start` checks and reapplies it before starting RBook.
- The patch is safe to run repeatedly and survives dependency reinstalls.

To apply it manually without starting RBook, run:

```powershell
pnpm run theme:dark
```

Or, with npm:

```powershell
npm run theme:dark
```

After applying the theme, refresh RBook in the browser. Use `Ctrl+F5` if the browser has cached the old stylesheet.

## How notebook storage works

RBook stores notebooks in its current working directory. The project's `start` script changes into `notebooks` before launching RBook:

```text
cd notebooks && node ../node_modules/rbook/bin/index.js
```

As a result:

- New notebooks are saved in `notebooks`.
- Existing RBook notebook JSON files should be placed directly in `notebooks`.
- RBook does not search subdirectories.
- Unrelated JSON files must not be placed in `notebooks`.
- Start RBook through `pnpm start` or `npm start`; do not launch the package directly from the project root.

## Troubleshooting

### Port 3050 is already in use

Another RBook instance is already running. Open http://localhost:3050 or stop the existing instance before starting another one.

### Notebooks disappear or the list breaks after refreshing

Confirm that:

1. RBook was started from the project root with `pnpm start` or `npm start`.
2. The `notebooks` directory contains only valid RBook notebook JSON files.
3. `package.json` remains in the project root, not in `notebooks`.
