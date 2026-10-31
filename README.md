# 🔄 micro-sync

> **The zero-config, local-first sync engine for modern JavaScript apps.**

[![CI](https://github.com/bayjonoyan2-ctrl/micro-sync/actions/workflows/ci.yml/badge.svg)](https://github.com/bayjonoyan2-ctrl/micro-sync/actions/workflows/ci.yml)
[![npm](https://img.shields.io/badge/npm-micro--sync-blue)](https://www.npmjs.com/package/micro-sync)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Zero deps](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D16-blue)](package.json)

![demo](assets/demo.gif)

## The problem

Building a local-first app (offline support, background sync, conflict resolution) usually requires massive backend setups (CouchDB, complex WebSockets, heavy CRDT libraries). 

## The fix

`micro-sync` is a single, lightweight utility you can drop into any JavaScript or TypeScript app. It hooks into your local database and automatically handles:
1. **Offline Queuing:** Saves data locally when the user is offline.
2. **Retry Logic:** Automatically pushes queued items when the connection returns.
3. **Conflict Resolution:** Uses a basic Last-Write-Wins (LWW) strategy with timestamps.

## Quick Start (1 line)

npm install micro-sync

## Usage

const MicroSync = require('micro-sync');

// 1. Initialize with your custom local storage (IndexedDB, SQLite, etc.)
const sync = new MicroSync({
  db: myCustomStorageAdapter, 
  apiEndpoint: 'https://myapi.com/sync'
});

// 2. Save data (it saves locally and syncs in the background)
await sync.save('users', { id: 1, name: 'Alice' });

## Why it works

- **Zero dependencies** — no massive node_modules bloat.
- **Drop-in ready** — works with any local storage adapter (browser, Node, React Native).
- **Local only** — your data stays on your user's device until they are ready to sync.

## Roadmap

- [ ] Full CRDT support (beyond basic LWW)
- [ ] React and Vue hooks
- [ ] Built-in IndexedDB adapter

## Contributing

PRs welcome. Run "npm test" before submitting.

## License

MIT © bayjonoyan2-ctrl