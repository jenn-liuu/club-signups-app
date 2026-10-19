# Club Sign-ups project guidance

## Before starting
- Read `SPEC.md` before starting any task. If it is missing, stop and ask the user how to proceed.
- Work one step at a time. Stop after each step and summarize what changed.

## Product context
- This app serves one club. Officers create events and track attendance; members sign up with their name and email.
- Design phone-first, with large tap targets.
- Show every error to the user; do not log an error and continue as if the operation succeeded.

## Stack and commands
- Use Next.js App Router with TypeScript, Supabase (Postgres and Auth), and Vercel.
- Run locally with `npm run dev`; build with `npm run build`.
- The intended test command is `npm test`, but this repository does not currently define a test script.

## Security and dependencies
- Ask before adding a dependency.
- Never put a Supabase secret key in the repository or frontend. Only the publishable key may be used in the browser.
- Enforce permissions with Supabase Row Level Security (RLS), not by hiding UI controls.
