# Creator Directory — Admin Screen

A React/Next.js admin screen for managing influencer/creator profiles. Built with TanStack Query for all server-state management, an Express mock API, and React Hook Form for validated forms.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Server state | TanStack Query v5 (React Query) |
| HTTP client | Axios |
| Forms | React Hook Form |
| Mock API | Express + CORS |
| Styling | Inline styles (no extra CSS framework needed) |

---

## Project Structure

```
creator-directory/
├── app/
│   ├── layout.js           ← QueryClientProvider + ReactQueryDevtools
│   ├── page.js             ← Main creators screen (all state lives here)
│   └── globals.css
├── components/
│   ├── CreatorsTable.js    ← Table with sort icons, niche/status badges
│   ├── CreatorModal.js     ← Create / Edit form with validation
│   ├── DeleteConfirmDialog.js ← Delete confirmation step
│   ├── FilterBar.js        ← Niche dropdown + follower range inputs
│   └── Pagination.js       ← Page buttons with ellipsis
├── hooks/
│   ├── useCreators.js      ← useQuery — paginated/sorted/filtered list
│   ├── useCreateCreator.js ← useMutation — POST /creators
│   ├── useUpdateCreator.js ← useMutation — PATCH /creators/:id
│   └── useDeleteCreator.js ← useMutation — DELETE /creators/:id
├── lib/
│   └── api.js              ← Axios instance + raw API functions
└── mock-server/
    ├── mock-server.js      ← Express server on port 4001
    ├── seed.json           ← 25 creator records
    └── package.json
```

---

## Setup & Run Instructions

### Prerequisites
- Node.js v18 or higher
- npm

### 1. Clone the repository

```bash
git clone https://github.com/sarveshpandit6769/creator-directory.git
cd creator-directory
```

### 2. Start the mock API server

Open **Terminal 1**:

```bash
cd mock-server
npm install
node mock-server.js
```

You should see:
```
Mock API running on http://localhost:4001
```

The mock server exposes these endpoints:
- `GET    /creators` — paginated, sorted, filtered list
- `POST   /creators` — create new creator
- `PATCH  /creators/:id` — update existing creator
- `DELETE /creators/:id` — delete creator

### 3. Start the Next.js frontend

Open **Terminal 2** (from the project root):

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Both terminals must stay running at the same time.

---

## Features

- **Data table** — Name, Niche, Followers (formatted e.g. `45.2K`), Engagement Rate (`3.8%`), Status badges, row actions
- **Server-side sorting** — click Followers or Engagement Rate column headers to sort asc/desc
- **Server-side filtering** — niche dropdown + min/max follower range, applied via query params
- **Server-driven pagination** — page buttons with ellipsis, shows `1–10 of 25`
- **Create/Edit modal** — validated form (name, email, niche required), pre-filled on edit
- **Delete with confirmation** — confirmation dialog before actual delete
- **Loading state** — shown while fetching
- **Error state** — shown with Retry button if API is unreachable
- **Empty state** — shown with Clear Filters button when no results match
- **Auto list refresh** — after any create/edit/delete the list updates automatically with no page reload

---

## Architecture Notes

### Query Key Strategy

All server-state for the creators list is keyed as:

```js
queryKey: ["creators", { page, limit, sortBy, order, niche, minFollowers, maxFollowers }]
```

The entire filter/sort/pagination object is nested inside the key. This means:
- Changing **any** filter param = new cache entry = automatic refetch
- Previous page data is kept visible (`placeholderData`) while the new page loads, preventing content flash
- TanStack Query deduplicates identical requests automatically

### Cache Invalidation After Mutations

Every mutation hook (create, update, delete) calls:

```js
queryClient.invalidateQueries({ queryKey: ["creators"] })
```

The `["creators"]` prefix matches **all** creator list cache entries regardless of which filters/page the user is on. This means:
- After creating a creator → the current page refetches and may show the new entry
- After editing a creator → the current page refetches with the updated data
- After deleting a creator → the current page refetches and the row disappears
- No manual reload button needed anywhere

### Separation of Concerns

- `lib/api.js` — plain async functions, no React, no hooks
- `hooks/use*.js` — TanStack Query wrappers, no JSX
- `components/` — pure presentation, receives data and callbacks as props, no direct fetch calls

### Mock API Choice

Used **Option A (Express server)** from the spec. Reasons:
- Easiest to reason about for a team — it's just a Node.js file
- Full control over response shape, delays, and error simulation
- No extra tooling required beyond `node mock-server.js`

---

## Assumptions Made

1. **Follower count and engagement rate are not required fields** — the spec only lists name, niche, and email as required for the form. Follower count and engagement rate are still validated when present (must be numbers in valid range).
2. **Sort state persists across filter changes** — if a user sorts by followers then filters by niche, the sort is preserved. Only the page resets to 1.
3. **Seed data is in-memory only** — the mock server resets to seed data on restart. This is acceptable for a challenge mock API.
4. **No authentication** — the spec doesn't mention auth so none was added.
5. **Status field defaults to "active"** on the create form since new creators are assumed to be active.

---

## What I'd Do Differently With More Time

- **Optimistic updates** — update the UI immediately on create/edit/delete and roll back on error, instead of waiting for the server round-trip
- **URL search params** — reflect filters/sort/page in the URL so filtered views are shareable and bookmarkable (`useSearchParams` + `useRouter`)
- **Real backend** — replace the in-memory Express mock with a real database (PostgreSQL + Prisma or similar)
- **Unit tests** — test hooks with `@testing-library/react` + `msw` for mocked API responses
- **Debounced follower range inputs** — avoid firing a new API request on every keystroke in the min/max follower fields
- **Row hover highlight** — small UX improvement on the table
- **Toast notifications** — show success/error toasts after mutations instead of just silently updating
- **Skeleton loading** — replace the text "Loading creators..." with a proper skeleton table
