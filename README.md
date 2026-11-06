# ADVSTAT Studio
Next.js 14 + TypeScript app: Simple Linear Regression and Z Hypothesis Testing, with login/registration (browser-local demo), light/dark mode and a greeting.

## Run locally
    npm install
    npm run dev      # http://localhost:3000

## Deploy to Vercel
Push this folder to GitHub, then on vercel.com choose "Add New → Project", import the repo and click Deploy (Next.js is auto-detected, no settings needed).
Or: `npm i -g vercel && vercel`.

Note: accounts are stored in the browser's localStorage (passwords SHA-256 hashed) — fine for a class demo, not real security.
