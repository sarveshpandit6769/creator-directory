"use client";

// Format follower count: 45200 -> 45.2K, 1200000 -> 1.2M
function formatFollowers(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export default function CreatorsTable({ data, sortBy, order, onSort, onEdit, onDelete }) {
  function SortIcon({ col }) {
    if (sortBy !== col) return <span style={{ color: "#9ca3af" }}> ↕</span>;
    return <span>{order === "asc" ? " ↑" : " ↓"}</span>;
  }

  function handleSort(col) {
    if (sortBy === col) {
      onSort(col, order === "asc" ? "desc" : "asc");
    } else {
      onSort(col, "asc");
    }
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Niche</th>
            <th
              style={{ ...thStyle, cursor: "pointer" }}
              onClick={() => handleSort("followerCount")}
            >
              Followers <SortIcon col="followerCount" />
            </th>
            <th
              style={{ ...thStyle, cursor: "pointer" }}
              onClick={() => handleSort("engagementRate")}
            >
              Eng. Rate <SortIcon col="engagementRate" />
            </th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((creator) => (
            <tr key={creator.id} style={trStyle}>
              <td style={tdStyle}>
                <div style={{ fontWeight: 500 }}>{creator.name}</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{creator.email}</div>
              </td>
              <td style={tdStyle}>
                <span style={nicheBadgeStyle(creator.niche)}>
                  {creator.niche}
                </span>
              </td>
              <td style={tdStyle}>{formatFollowers(creator.followerCount)}</td>
              <td style={tdStyle}>{creator.engagementRate.toFixed(1)}%</td>
              <td style={tdStyle}>
                <span style={statusBadgeStyle(creator.status)}>
                  {creator.status}
                </span>
              </td>
              <td style={tdStyle}>
                <button onClick={() => onEdit(creator)} style={actionBtnStyle}>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(creator)}
                  style={{ ...actionBtnStyle, color: "#ef4444", marginLeft: "8px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- styles ---
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px",
};

const thStyle = {
  textAlign: "left",
  padding: "10px 16px",
  borderBottom: "2px solid #e5e7eb",
  fontWeight: 600,
  color: "#374151",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px 16px",
  borderBottom: "1px solid #f3f4f6",
  verticalAlign: "middle",
};

const trStyle = {
  transition: "background 0.15s",
};

const actionBtnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  color: "#3b82f6",
  padding: "2px 4px",
};

function nicheBadgeStyle(niche) {
  const colors = {
    beauty: { bg: "#fdf2f8", color: "#9d174d" },
    fitness: { bg: "#f0fdf4", color: "#166534" },
    travel: { bg: "#eff6ff", color: "#1e40af" },
    food: { bg: "#fff7ed", color: "#9a3412" },
    tech: { bg: "#f5f3ff", color: "#5b21b6" },
    fashion: { bg: "#fefce8", color: "#854d0e" },
  };
  const c = colors[niche] || { bg: "#f3f4f6", color: "#374151" };
  return {
    background: c.bg,
    color: c.color,
    padding: "2px 10px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: 500,
    textTransform: "capitalize",
  };
}

function statusBadgeStyle(status) {
  return {
    background: status === "active" ? "#f0fdf4" : "#f9fafb",
    color: status === "active" ? "#166534" : "#6b7280",
    padding: "2px 10px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: 500,
    textTransform: "capitalize",
  };
}