# Project: LLM Metaverse Server

## Project Overview

This project is the backend server for the LLM Metaverse. It is a Colyseus-based server responsible for managing the real-time state of the metaverse, including player positions, rotations, and other interactions. The server is written in TypeScript.

### Key Technologies:

- **Framework:** [Colyseus](https://www.colyseus.io/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

### Architecture:

- **`src/index.ts`**: The main entry point for the server. It registers the room handlers.
- **`src/app.config.ts`**: Configures the Colyseus server, including defining rooms and Express routes.
- **`src/rooms/MyRoom.ts`**: Implements the core game logic for the metaverse, handling player state and messages.
- **`src/rooms/schema/MyRoomState.ts`**: Defines the schema for the room state, including player data structures.

## Building and Running

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will be available at `ws://localhost:2567`.

### 3. Run Tests

```bash
npm test
```

### 4. Run Load Test

```bash
npm run loadtest
```

## Development Conventions

- **State Management:** The server uses Colyseus Schema for managing the room state. The state is defined in `src/rooms/schema/MyRoomState.ts`.
- **Messaging:** Client-server communication is handled through message types defined in `src/rooms/schema/MyRoomState.ts`. The `MyRoom.ts` file contains the message handlers.
- **Configuration:** The server is configured in `src/app.config.ts`. This file is used to define rooms, and middleware.
