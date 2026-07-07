"use client";
import { useState } from "react";
import { useCreators } from "../hooks/useCreators";
import CreatorsTable from "../components/CreatorsTable";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import CreatorModal from "../components/CreatorModal";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";

export default function CreatorsPage() {
  // All filter/sort/page state lives here
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: "",
    order: "asc",
    niche: "",
    minFollowers: "",
    maxFollowers: "",
  });

  const [modalCreator, setModalCreator] = useState(null);   // null=closed, {}=create, creator=edit
  const [deleteTarget, setDeleteTarget] = useState(null);   // null=closed, creator=open

  const { data, isLoading, isError, error } = useCreators(filters);

  function handleSort(col, dir) {
    setFilters((f) => ({ ...f, sortBy: col, order: dir, page: 1 }));
  }

  // --- Loading state ---
  if (isLoading) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
      Loading creators...
    </div>
  );

  // --- Error state ---
  if (isError) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
      <p>Something went wrong: {error.message}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Creators</h1>
        <button onClick={() => setModalCreator({})}>+ Add Creator</button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {/* Empty state */}
      {data.data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
          <p>No creators found.</p>
          <button onClick={() => setFilters({ page: 1, limit: 10, sortBy: "", order: "asc", niche: "", minFollowers: "", maxFollowers: "" })}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <CreatorsTable
            data={data.data}
            sortBy={filters.sortBy}
            order={filters.order}
            onSort={handleSort}
            onEdit={(creator) => setModalCreator(creator)}
            onDelete={(creator) => setDeleteTarget(creator)}
          />
          <Pagination
            page={filters.page}
            limit={filters.limit}
            total={data.total}
            onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          />
        </>
      )}

      {/* Create/Edit Modal */}
      {modalCreator !== null && (
        <CreatorModal
          creator={Object.keys(modalCreator).length > 0 ? modalCreator : null}
          onClose={() => setModalCreator(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteConfirmDialog
          creator={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}