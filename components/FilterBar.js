"use client";

const NICHES = ["beauty", "fitness", "travel", "food", "tech", "fashion"];

export default function FilterBar({ filters, onChange }) {
  function handleChange(key, value) {
    // Reset to page 1 whenever a filter changes
    onChange({ ...filters, [key]: value, page: 1 });
  }

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
      {/* Niche dropdown */}
      <select
        value={filters.niche || ""}
        onChange={(e) => handleChange("niche", e.target.value)}
        style={selectStyle}
      >
        <option value="">All Niches</option>
        {NICHES.map((n) => (
          <option key={n} value={n}>
            {n.charAt(0).toUpperCase() + n.slice(1)}
          </option>
        ))}
      </select>

      {/* Min followers */}
      <input
        type="number"
        placeholder="Min Followers"
        value={filters.minFollowers || ""}
        onChange={(e) => handleChange("minFollowers", e.target.value)}
        style={inputStyle}
      />

      {/* Max followers */}
      <input
        type="number"
        placeholder="Max Followers"
        value={filters.maxFollowers || ""}
        onChange={(e) => handleChange("maxFollowers", e.target.value)}
        style={inputStyle}
      />

      {/* Clear filters */}
      <button
        onClick={() => onChange({ page: 1, limit: filters.limit })}
        style={btnStyle}
      >
        Clear Filters
      </button>
    </div>
  );
}

const selectStyle = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
};

const inputStyle = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  width: "140px",
};

const btnStyle = {
  padding: "8px 16px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
  background: "#f9fafb",
};