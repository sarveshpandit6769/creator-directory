"use client";

const NICHES = ["beauty", "fitness", "travel", "food", "tech", "fashion"];

// Default clean state — used when clearing filters
const DEFAULT_FILTERS = {
  niche: "",
  minFollowers: "",
  maxFollowers: "",
  sortBy: "",
  order: "asc",
  page: 1,
};

export default function FilterBar({ filters, onChange }) {
  function handleChange(key, value) {
    // Always reset to page 1 when any filter changes
    onChange({ ...filters, [key]: value, page: 1 });
  }

  function handleClear() {
    // Reset everything — filters, sort, and page — keep only limit
    onChange({ ...DEFAULT_FILTERS, limit: filters.limit });
  }

  const hasActiveFilters =
    filters.niche || filters.minFollowers || filters.maxFollowers;

  return (
    <div style={containerStyle}>
      {/* Niche dropdown */}
      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Niche</label>
        <select
          value={filters.niche || ""}
          onChange={(e) => handleChange("niche", e.target.value)}
          style={selectStyle}
          aria-label="Filter by niche"
        >
          <option value="">All Niches</option>
          {NICHES.map((n) => (
            <option key={n} value={n}>
              {n.charAt(0).toUpperCase() + n.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Min Followers */}
      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Min Followers</label>
        <input
          type="number"
          min="0"
          placeholder="e.g. 10000"
          value={filters.minFollowers || ""}
          onChange={(e) => handleChange("minFollowers", e.target.value)}
          style={inputStyle}
          aria-label="Minimum follower count"
        />
      </div>

      {/* Max Followers */}
      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Max Followers</label>
        <input
          type="number"
          min="0"
          placeholder="e.g. 500000"
          value={filters.maxFollowers || ""}
          onChange={(e) => handleChange("maxFollowers", e.target.value)}
          style={inputStyle}
          aria-label="Maximum follower count"
        />
      </div>

      {/* Clear Filters button — only shown when a filter is active */}
      {hasActiveFilters && (
        <div style={{ ...fieldGroupStyle, justifyContent: "flex-end" }}>
          <label style={{ ...labelStyle, visibility: "hidden" }}>Clear</label>
          <button onClick={handleClear} style={clearBtnStyle} aria-label="Clear all filters">
            ✕ Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const containerStyle = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  alignItems: "flex-end",
  marginBottom: "20px",
  padding: "16px",
  background: "#f9fafb",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const selectStyle = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  background: "#fff",
  color: "#111827",
  minWidth: "140px",
  cursor: "pointer",
};

const inputStyle = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  background: "#fff",
  color: "#111827",
  width: "140px",
};

const clearBtnStyle = {
  padding: "8px 14px",
  border: "1px solid #fca5a5",
  borderRadius: "6px",
  fontSize: "13px",
  cursor: "pointer",
  background: "#fef2f2",
  color: "#dc2626",
  fontWeight: 500,
};
