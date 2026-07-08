"use client";

export default function Pagination({ page, limit, total, onChange }) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px", justifyContent: "flex-end" }}>
      <span style={{ fontSize: "14px", color: "#ffffffff" }}>
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </span>

      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        style={btnStyle(page === 1)}
      >
        ← Prev
      </button>

      {/* Page number buttons */}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce((acc, p, idx, arr) => {
          if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
          acc.push(p);
          return acc;
        }, [])
        .map((item, idx) =>
          item === "..." ? (
            <span key={`ellipsis-${idx}`} style={{ color: "#9ca3af" }}>...</span>
          ) : (
            <button
              key={item}
              onClick={() => onChange(item)}
              style={pageBtnStyle(item === page)}
            >
              {item}
            </button>
          )
        )}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        style={btnStyle(page === totalPages)}
      >
        Next →
      </button>
    </div>
  );
}

function btnStyle(disabled) {
  return {
    padding: "6px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    background: "#000000ff",
  };
}

function pageBtnStyle(active) {
  return {
    padding: "6px 12px",
    border: "1px solid",
    borderColor: active ? "#3b82f6" : "#d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
    background: active ? "#3b82f6" : "#fff",
    color: active ? "#fff" : "#374151",
    fontWeight: active ? 600 : 400,
  };
}