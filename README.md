# Figma Plugin Authentication with Better Auth

This repository demonstrates how to add authentication to a Figma plugin using [Better Auth](https://www.better-auth.com/). It leverages WebSocket communication to securely exchange session tokens, providing a smooth login experience for users.

## Features

- **OAuth with Better Auth**: Users can log in with Google through Better Auth.
- **WebSocket Integration**: Session tokens are securely exchanged between the server and the Figma plugin using WebSockets.
- **State Management**: User session and profile data are managed with Zustand for easy access across components.

## Getting Started

### 1. Install Dependencies

Install the necessary dependencies with `pnpm`:

```bash
pnpm install
```

### 2. Set Up Environment Variables

Add your environment variables in a `.env` file:

```plaintext
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000
TURSO_DATABASE_URL=xxxxx
TURSO_AUTH_TOKEN=xxxxx
```

### 3. Run the Server

Start the server to enable authentication routes and WebSocket handling:

```bash
pnpm start
```

### 4. Configure Figma Plugin

Use the `AuthButton` component to open the login URL and connect the plugin to WebSocket. The WebSocket receives the session token after authentication.

### Demo Video

[![Demo Video](https://i3.ytimg.com/vi/hMJatzPlUeU/maxresdefault.jpg)](https://youtu.be/hMJatzPlUeU)

For a full demonstration, watch the video tutorial:

[https://youtu.be/hMJatzPlUeU](https://youtu.be/hMJatzPlUeU)
