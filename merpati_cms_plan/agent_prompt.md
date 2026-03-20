# Agent Prompt: MERPATI-CMS Iterative Coding Instructions

## Overview
You are tasked with building MERPATI-CMS, a high-performance, serverless publishing platform. Your development process must strictly follow the pre-defined architecture and sequence outlined in the project planning documents.

## Context & Rules
Before writing any code, you MUST review the following foundational documents to understand the global constraints, tech stack, and design rules:
1.  **`PRD.md`**: Understands the core goals ("Media Editorial Ringkas, Praktis, Aman, Tetap Independen") and the "No Capes" philosophy.
2.  **`modules.md`**: Grasp the Global Tech Stack (Next.js, Tailwind v4, Drizzle, Neon, Auth.js) and the strict separation between Admin UI (`shadcn/ui`) and Public UI (Pure Tailwind v4).
3.  **`reference/*`**: Review specific library integrations like Drizzle/Neon, Auth.js JWT strategy, TipTap, Telegram API, and Vercel Blob.

## Execution Sequence (The Module Orchestration)
The project is divided into 9 sequential modules located in the `modules/` directory (`0-setup.md` through `8-seo.md`). You must build the application module by module.

**CRITICAL DIRECTIVES FOR EXECUTION:**
1.  **Iterative Focus:** Do not attempt to build the entire CMS at once. Focus purely on the requirements of the *current* module file you are executing.
2.  **Context Amnesia Prevention:** Before starting a new module, **you MUST review the codebase and files created in previous modules**. Reuse existing components, layouts, utility functions, and schema definitions to prevent duplication and ensure consistency.
3.  **Strict Pausing:** After completing the tasks within a specific `modules/X-*.md` file, you MUST **pause, explain what was achieved, notify the user, and wait for explicit approval** before proceeding to the next module. 
4.  **Verification:** Before requesting approval for a completed module, run `pnpm lint` and `pnpm build` (or `npm run build`) to ensure the application compiles successfully and there are no glaring TypeScript errors.

## How to Start
When the user says "Begin Execution" or "Start Module 0":
1.  Read `modules/0-setup.md` carefully.
2.  Execute the scaffolding, styling setup, and database initialization defined within it.
3.  Verify the setup.
4.  Pause and request user approval.
5.  Wait for the command to proceed to Module 1.

*Stay focused, keep it lean, and build it fabulous.*
