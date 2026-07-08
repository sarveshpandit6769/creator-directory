"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreators } from "../hooks/useCreators";
import CreatorsTable from "../components/CreatorsTable";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import CreatorModal from "../components/CreatorModal";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Read filters from URLSearchParams — falls back to defaults for missing params
function filtersFromParams(params) {
  return {
    page: Number(params.get("page") || 1),
    limit: Number(params.get("limit") || 10),
    sortBy: params.get("sortBy") || "",
    order: params.get("order") || "asc",
    niche: params.get("niche") || "",
    minFollowers: params.get("minFollowers") || "",
    maxFollowers: params.get("maxFollowers") || "",
  };
}

// Serialize filters back to a URLSearchParams string — skips empty values
function filtersToParams(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      // Skip page=1 and limit=10 (defaults) to keep URLs clean
      if (key === "page" && Number(value) === 1) return;
      if (key === "limit" && Number(value) === 10) return;
      if (key === "order" && value === "asc") return;
      params.set(key, value);
    }
  });
  return params.toString();
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function CreatorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialise filter state from URL on first render
  const [filters, setFiltersState] = useState(() =>
    filtersFromParams(searchParams)
  );

  const [modalCreator, setModalCreator] = useState(null); // null=closed, {}=create, creator=edit
  const [deleteTarget, setDeleteTarget] = useState(null); // null=closed, creator=open

  const { data, isLoading, isError, error } = useCreators(filters);

  // ─── Sync filters → URL ─────────────────────────────────────────────────────
  // Whenever filters change, push the new query string to the URL so the view
  // is bookmarkable and shareable.
  const setFilters = useCallback(
    (newFilters) => {
      const resolved =
        typeof newFilters === "function" ? newFilters(filters) : newFilters;
      setFiltersState(resolved);
      const qs = filtersToParams(resolved);
      router.replace(qs ? `?${qs}` : "/", { scroll: false });
    },
    [filters, router]
  );

  // ─── Sync URL → filters on browser back/forward ────────────────────────────
  useEffect(() => {
    setFiltersState(filtersFromParams(searchParams));
  }, [searchParams]);

  function handleSort(col, dir) {
    setFilters((f) => ({ ...f, sortBy: col, order: dir, page: 1 }));
  }

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={centerStyle}>
        <div style={spinnerStyle} />
        <p style={{ color: "#6b7280", marginTop: "12px" }}>Loading creators...</p>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div style={centerStyle}>
        <p style={{ color: "#ef4444", fontSize: "16px", marginBottom: "12px" }}>
          Could not load creators: {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={retryBtnStyle}
        >
          Retry
        </button>
      </div>
    );
  }

  const hasActiveFilters =
    filters.niche || filters.minFollowers || filters.maxFollowers;

  return (
    <div style={pageStyle}>
      {/* ── Header ── */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Creators</h1>
          <p style={subtitleStyle}>
            {data.total} creator{data.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => setModalCreator({})}
          style={addBtnStyle}
          aria-label="Add new creator"
        >
          + Add Creator
        </button>
      </div>

      {/* ── Filters ── */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* ── Empty state ── */}
      {data.data.length === 0 ? (
        <div style={emptyStyle}>
          <p style={{ fontSize: "16px", fontWeight: 500, color: "#374151" }}>
            No creators found
          </p>
          <p style={{ fontSize: "14px", color: "#9ca3af", margin: "4px 0 16px" }}>
            {hasActiveFilters
              ? "Try adjusting or clearing your filters."
              : "Add your first creator to get started."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() =>
                setFilters({
                  page: 1,
                  limit: filters.limit,
                  sortBy: "",
                  order: "asc",
                  niche: "",
                  minFollowers: "",
                  maxFollowers: "",
                })
              }
              style={retryBtnStyle}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ── Table ── */}
          <CreatorsTable
            data={data.data}
            sortBy={filters.sortBy}
            order={filters.order}
            onSort={handleSort}
            onEdit={(creator) => setModalCreator(creator)}
            onDelete={(creator) => setDeleteTarget(creator)}
          />

          {/* ── Pagination ── */}
          <Pagination
            page={filters.page}
            limit={filters.limit}
            total={data.total}
            onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          />
        </>
      )}

      {/* ── Create / Edit modal ── */}
      {modalCreator !== null && (
        <CreatorModal
          creator={Object.keys(modalCreator).length > 0 ? modalCreator : null}
          onClose={() => setModalCreator(null)}
        />
      )}

      {/* ── Delete confirmation ── */}
      {deleteTarget && (
        <DeleteConfirmDialog
          creator={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const pageStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "32px 16px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};

const titleStyle = {
  fontSize: "26px",
  fontWeight: 700,
  color: "#8604e9ff",
  margin: 0,
};

const subtitleStyle = {
  fontSize: "14px",
  color: "#00e5ffff",
  margin: "4px 0 0 0",
};

const addBtnStyle = {
  padding: "10px 20px",
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};

const centerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "300px",
  padding: "40px",
};

const emptyStyle = {
  textAlign: "center",
  padding: "60px 20px",
  background: "#f9fafb",
  borderRadius: "8px",
  border: "1px dashed #e5e7eb",
};

const retryBtnStyle = {
  padding: "9px 20px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  background: "#fff",
  fontSize: "14px",
  cursor: "pointer",
  color: "#374151",
};

const spinnerStyle = {
  width: "36px",
  height: "36px",
  border: "3px solid #e5e7eb",
  borderTop: "3px solid #3b82f6",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};
