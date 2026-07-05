const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Load seed data — we keep a mutable in-memory array
let creators = require("./seed.json");

// ─── GET /creators ────────────────────────────────────────────────────────────
// Query params: page, limit, sortBy, order, niche, minFollowers, maxFollowers
app.get("/creators", (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy,
    order = "asc",
    niche,
    minFollowers,
    maxFollowers,
  } = req.query;

  let results = [...creators];

  // Filtering
  if (niche) {
    results = results.filter((c) => c.niche === niche);
  }
  if (minFollowers) {
    results = results.filter((c) => c.followerCount >= Number(minFollowers));
  }
  if (maxFollowers) {
    results = results.filter((c) => c.followerCount <= Number(maxFollowers));
  }

  // Sorting
  if (sortBy) {
    results.sort((a, b) =>
      order === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]
    );
  }

  const total = results.length;
  const start = (Number(page) - 1) * Number(limit);
  const pageData = results.slice(start, start + Number(limit));

  res.json({
    data: pageData,
    total,
    page: Number(page),
    limit: Number(limit),
  });
});

// ─── POST /creators ───────────────────────────────────────────────────────────
app.post("/creators", (req, res) => {
  const creator = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  creators.push(creator);
  res.status(201).json(creator);
});

// ─── PATCH /creators/:id ──────────────────────────────────────────────────────
app.patch("/creators/:id", (req, res) => {
  const idx = creators.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Creator not found" });
  }
  creators[idx] = { ...creators[idx], ...req.body };
  res.json(creators[idx]);
});

// ─── DELETE /creators/:id ─────────────────────────────────────────────────────
app.delete("/creators/:id", (req, res) => {
  const idx = creators.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Creator not found" });
  }
  creators = creators.filter((c) => c.id !== req.params.id);
  res.status(204).send();
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(4001, () => {
  console.log("Mock API running on http://localhost:4001");
});
