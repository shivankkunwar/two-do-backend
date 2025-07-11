# Two-Do API: Backend

This is the backend for the Two-Do app. It handles user accounts, authentication, and all your to-do data. Fast, secure, and simple.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your values.
3. **Start the backend:**
   ```bash
   npm run dev
   ```
   The API runs at [http://localhost:3000](http://localhost:3000) by default.

## Stack & Approach
- **Express.js** + **TypeScript**
- **MongoDB** for storage
- **JWT** for authentication (access & refresh tokens, with blacklist)
- **Philosophy:** Keep it secure, keep it simple, and make it easy to learn from.


