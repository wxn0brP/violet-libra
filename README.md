# Violet Libra

A simple, lightweight CMS/blogging platform built with Bun, TypeScript, and a custom VQL API.

## ⚠️ Project Status: MVP / Work in Progress ⚠️

This project is currently a Minimum Viable Product (MVP) and a work in progress. It is intended as a proof of concept and is not yet ready for production use. Features may be incomplete or subject to change.

## Tech Stack

*   **Backend:** TypeScript, Bun, [@wxn0brp/falcon-frame](https://www.npmjs.com/package/@wxn0brp/falcon-frame)
*   **API:** [@wxn0brp/vql](https://www.npmjs.com/package/@wxn0brp/vql) (a custom GraphQL-like implementation)
*   **Frontend (CMS):** TypeScript, esbuild, Yarn, [@wxn0brp/flanker-ui](https://www.npmjs.com/package/@wxn0brp/flanker-ui), EasyMDE
*   **Authentication:** JWT-based authentication with [@wxn0brp/gate-warden](https://www.npmjs.com/package/@wxn0brp/gate-warden)
*   **Development:** `suglite` for watching files and running commands.

## Getting Started

### Prerequisites

* [Bun](https://bun.sh/)

### Installation

```bash
bun run install:all
bun run build:front
```

### Running

```bash
bun run back/index.ts
```

The application will be available at `http://localhost:15987`.