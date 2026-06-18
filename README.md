# Violet Libra

A simple, lightweight CMS/blogging platform built with Bun, TypeScript, and a custom VQL API.

## Getting Started

### Prerequisites

* [Bun](https://bun.sh/)

### Installation

```bash
bun run install:all
bun run build:front

cp .env.example .env
nano .env

./admin.sh setup admin "password-change-me"
```

### Running

```bash
bun run src/index.ts
```

The application will be available at `http://localhost:15987`.

## Admin Scripts

### Manage configuration

```bash
./admin.sh config
./admin.sh config app.name
./admin.sh config app.name "My Blog"
```

### Manage users

```bash
./admin.sh user
./admin.sh user add editor "secret" --admin
./admin.sh user password editor "new-secret"
./admin.sh user admin editor
```

## License

MIT
