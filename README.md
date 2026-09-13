# BALANCEIAGA by PulseX

**Github Repo:** [link]
**Team:** MAK JIA HNG, NICHOLAS OOI JIN YONG, CHARIYA A/P NAI NARONG, LIAN YU HERNG
**Problem Statement:** Stress & Workload Manager
**Video Presentation:** [Unlisted Youtube Link]
**Presentation Slides:** [Public Link]

## 1. Project Overview

**The Problem.** University students often burn out not because they lack a way to track tasks, but because their workload isn't managed realistically. Most productivity apps treat every deadline as fixed and assume that any free slot on the calendar is usable energy — they don't account for how much a person can actually handle at once, or for last-minute schedule changes. The people affected are university students juggling academic work, extracurriculars, social commitments, part-time jobs, and their own wellbeing.

Existing tools like Motion, Todoist, and Sunsama fall short here — when a student gets overloaded, these apps just push deadlines further back or fill up whatever calendar space is left. None of them actually check if the student has the capacity to take on more, prioritize what matters most, or protect time for the student to rest.

**Our Solution.** **BALANCEIAGA** is a workload management app that figures out a student's real planning capacity, catches overload before it turns into burnout, and gives 1-tap suggestions to rebalance the schedule. Instead of making students manually shuffle around conflicting tasks, it looks at deadline urgency, how flexible each commitment is, and how much recovery time is left, then recommends the best way to shift things around — without touching the tasks that matter most.

**Feature Set:** Overload Dashboard; 1-Tap Workload Rebalancer; Capacity & Burnout Engine; AI Task Analyzer; Smart Task Tagging; Monthly Calendar View; Google Calendar Sign-in & Import; Recovery & Emergency Brake; Guided Reflection; Notifications.

* **Overload Dashboard** — one main screen showing the 4-pillar load breakdown (Mental, Physical, Social, Time Pressure), an overload percentage, and today's scheduled sessions.
* **1-Tap Workload Rebalancer** — generates realistic ways to fix an overloaded schedule (move, split, or redistribute tasks) while protecting high-priority items.
* **Capacity & Burnout Engine** — works out real usable hours by subtracting fixed commitments, protected routines, and recovery buffers from the day, and flags when a student is overloaded.
* **AI Task Analyzer** — students paste a task description and the app breaks it into subtasks with hour estimates, mental demand, urgency, and flexibility — built as a fast, rule-based simulation rather than a live LLM call.
* **Smart Task Tagging** — every task is marked as either 🔒 Protected or 🌊 Flexible, so the engine knows what it's allowed to move.
* **Monthly Calendar View** — plan ahead and spot overload clusters before they happen.
* **Google Calendar Sign-in & Import** — sign in with Google and pull in upcoming calendar events (read-only).
* **Recovery & Emergency Brake** — a recovery zone with suggested activities, plus a dedicated emergency-mode screen for critical overload.
* **Guided Reflection** — a page for reviewing past stressful periods.
* **Notifications** — an in-app notifications page with settings and task-status tracking.

## 2. Ideation & Process

### 2.1 Ideas We Considered

| **Idea**                                                             | **Why it was dropped / kept**                                                                                                                                                                                                                                                             |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A — Deterministic capacity & rebalance engine (Chosen)**           | Mentor pushed back on relying on "black-box" AI for the core decision logic, and pointed out AI-driven scheduling would need 1,000–2,000+ real data entries to be trustworthy — which we don't have. Kept because it's transparent, explainable, and realistic to build in the timeframe. |
| **B — AI-assisted PDF/syllabus parser (Chosen)**                     | Kept as the "wow factor" feature — this is a good use of AI (structured JSON extraction) rather than using AI to make scheduling decisions, so it doesn't hit the same "black-box" concern.                                                                                               |
| **C — Full AI-driven scheduling (Dropped)**                          | Both early concepts (from Claude and Gemini's brainstorms) leaned on AI to detect urgency/flexibility and make scheduling calls directly. Dropped after mentor feedback — no dataset to train or validate this, and it would be hard to explain *why* the AI made a given decision.       |
| **D — Two-way Google/Apple Calendar sync (Downgraded, not dropped)** | Originally a "must-have" in the Gemini concept. Moved to secondary/good-to-have scope — still valuable, but not required to solve the core problem, and connecting to multiple calendar providers adds real build risk.                                                                   |
| **E — Rigid, locked daily time slots (Dropped)**                     | Original design locked tasks into fixed slots once scheduled. Mentor feedback flagged this as something that could increase anxiety, not reduce it. Replaced with flexible micro-milestones the student can adjust.                                                                       |

### 2.2 Ideation Boards

You can embed the images directly (recommended) or have links to your ideation board. Don’t feel forced to add as many diagrams as you can for “more marks”. The reviewers want to know how your team put their minds together to create your solution. It can be messy, with a lot of small dropped ideas. Add 1–2 lines under each explaining what it shows.

**Mindmap:** A mindmap brainstorming raw features, constraints, AI scheduling concepts, and metrics to address student burnout.

**Structured Diagram:** A structured diagram illustrating the root causes, core issue, and downstream academic/physical effects of student burnout.

**Breakdown Tree:** A breakdown tree diagram categorizing the key factors contributing to student academic burnout and capacity depletion.

**IMPORTANT:** You can express this in any way you like, including but not limited to: Mindmaps, Problem trees, Flowcharts, User flows, Crazy eights, Affinity diagrams, SCAMPER grids, Fishbone diagrams, 5 Whys chains, and Any other scribbles :)

You can embed images in markdown like so:

`![Mindmap](mindmap.png)`

### 2.3 Mentor Consultation

| **Date**        | **Mentor**         | **Feedback Received**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | **What Was Changed**                                                                                                                                                                                                                                                                                 |
| --------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **4 Sep (Thu)** | Daniel Koh Yu Hang | Focus on one specific core problem instead of trying to solve everything. Push calendar integration further (let users connect Google Calendar). Consider more activity types — exams, part-time jobs. Make sure the AI's decision-making is fully transparent, not a black box. Sort features into Must-Have / Good-to-Have / Quality-of-Life tiers, and let the QoL tier be where the team stands out. Also flagged that using AI for scheduling decisions needs a real dataset (1,000–2,000+ entries) — without that, don't rely on trained AI for the core logic. | Narrowed the problem to "student workload causing stress → rebalance it." Rebuilt the core engine to run on deterministic logic (explicit rules: deadline urgency, task category, duration) instead of AI. Reorganized every feature into 🔴 Must-Have / 🟡 Good-to-Have / 🟢 Quality-of-Life tiers. |
| **8 Sep (Tue)** | Lim Zi Yang        | Gave a tech-stack + priority breakdown for the demo: Frontend UI & Dashboard and the Capacity/Rebalance Engine and PDF Parser are Critical; Calendar Sync is High priority but secondary; PWA install and Recovery widget are good-to-have visual/QoL additions.                                                                                                                                                                                                                                                                                                      | Locked in the build scope and priority order used in the final tech stack and build plan sections below.                                                                                                                                                                                             |

## 3. Design & Prototype

**UI Prototype:** https://ivanmaktech-balanceiaga.vercel.app/

Check that it opens in an incognito window. This can be a link to Figma, Canva, Netlify, Vercel or any other board where you showcase your UI. It can be clickable with hyperlinks or simply ordered screenshots.

We recommend you embed or link 4–8 key screens as images, with a caption on each explaining the interaction.

* **Overload Dashboard** — User can instantly see how heavy their day is.
* **Load Breakdown & Capacity View** — Load Breakdown allow user to see what’s consuming their time and energy; Capacity View allow user know how much time they realistically have; Monthly Calendar allow user to plan ahead and prevent overload.
* **Monthly Calendar & Google Calendar** — Monthly calendar allow user see workload at a glance across the month; Google Calendar bring your existing commitments here.
* **Daily Schedule** — User can edit, move and organise task around their day.
* **Overload Detection** — Show user there are overloaded.
* **AI Rebalance** — Rebalance option analyses deadline, duration, priority, flexibility, consequence, protected time or user can edit to fine-tune their plan manually.
* **Recovery Recommendations** — User can get activities matched to their current needs.
* **Schedule Recovery** — Fit recovery to user availability.

## 4. What Makes It Different

| **Feature**             | **Existing Tools (Motion, Todoist, Sunsama)**                                | **Balanceiaga**                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Overload Management** | Pushes tasks back blindly or crowds free calendar space until burnout occurs | Realistic Capacity Engine — subtracts fixed commitments, protected routines, and rest buffers to actually detect overload                 |
| **Rebalancing Logic**   | Requires tedious manual dragging and rescheduling of individual tasks        | 1-Tap Multi-Option Rebalancing — generates smart, constraint-aware options (Move, Split, Defer) while protecting high-priority work       |
| **Workload Input**      | Manual text entry of every single sub-task and duration                      | AI Task Analyzer — paste a task description and get a structured breakdown with hour estimates and subtasks                               |
| **Health & Wellbeing**  | Treats free time as empty space to fill with more work                       | Protected Recovery Zone — unlocks dedicated recovery blocks, an emergency-mode screen for critical overload, and a guided reflection page |

## 5. Technical Architecture & Feasibility

**Tech stack**

* **Frontend + Backend:** Next.js 16 (App Router) + React 19 + TypeScript, styled with Tailwind CSS v4. *Why:* Next.js API routes (`app/api/...`) act as the backend, so there's no separate Express server to stand up and deploy — one app, one deployment, less moving parts for a hackathon timeline. *Constraint:* since frontend and backend live in one app, scaling the backend independently later would need splitting this out.
* **Auth & Calendar:** NextAuth.js with the Google provider, using the `googleapis` package for calendar reads. *Why:* students sign in with Google, and the app requests calendar read-only access to pull in upcoming events. *Constraint:* this is currently **read-only import** — there's no two-way sync or `.ics` export wired up yet, even though earlier planning docs describe two-way sync.
* **Data layer:** currently static/mock data (`lib/mockData.ts` and similar files) — **no database is connected yet** (no Supabase, no Postgres, nothing persisting between sessions). *Constraint:* this means tasks, capacity numbers, and recovery data all reset — nothing a student adds is actually saved right now.
* **AI Task Analyzer:** rule-based, keyword-matching logic (no external AI call) — analyzes pasted task text and returns a fast, deterministic breakdown. *Why this is actually good:* it directly satisfies the mentor's "no black-box AI, no untrained model" feedback, since every decision can be explained by a simple if/else rule.
* **AI Rebalance Suggestions:** an optional layer that can call an external LLM (OpenAI/Gemini-style endpoint) for extra rebalance ideas, controlled by environment variables (`AI_REBALANCE_ENDPOINT`, `AI_REBALANCE_API_KEY`). If those aren't set, it quietly skips and just uses the deterministic options. *Constraint:* this means the "AI" part of rebalancing is currently optional/unconfigured — worth deciding if you want it live and configured for the demo, or if you're leaning fully on the deterministic engine.

*System architecture diagram: not included — optional, add if it'll help reviewers follow the flow.*

### Build Plan & Scope

Based on what's actually built in the repo so far:

1. **Core Capacity & Overload Engine** (Must-Have) — ✅ built. Calculates realistic capacity from fixed vs. flexible commitments and flags overload.
2. **1-Tap Rebalancing Engine** (Must-Have) — ✅ built, deterministic by default, with an optional AI-suggestion layer on top (env-gated, off unless configured).
3. **Interactive Load Dashboard** (Must-Have) — ✅ built. Shows the 4-pillar load breakdown and today's sessions.
4. **AI Task Analyzer** (Must-Have) — ✅ built, as rule-based logic rather than a live AI/PDF parser.
5. **Google Calendar Sign-in & Read Import** (Good-to-Have) — ✅ built, read-only for now.
6. **Recovery Zone + Emergency Brake** (Quality-of-Life) — ✅ built as dedicated pages.
7. **Guided Reflection** (Quality-of-Life) — ✅ built as a dedicated page.
8. **Notifications (+ settings, task status)** (Quality-of-Life) — ✅ built.
9. **AI PDF/Syllabus Parser** (originally Must-Have / Wow Factor) — ❌ not found in the repo yet.
10. **Database / persistence** (originally planned via Supabase) — ❌ not connected yet; everything currently runs on mock data.
11. **Two-way calendar sync / .ics export** (originally Good-to-Have) — ❌ not built; current calendar feature is import-only.
