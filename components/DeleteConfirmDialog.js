"use client";

import { useDeleteCreator } from "../hooks/useDeleteCreator";

export default function DeleteConfirmDialog({ creator, onClose }) {
  const deleteMutation = useDeleteCreator();

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(creator.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete creator:", error);
      alert("Failed to delete creator.");
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <h2 style={titleStyle}>Delete Creator</h2>

        <p style={textStyle}>
          Are you sure you want to delete{" "}
          <strong>{creator?.name}</strong>?
        </p>

        <p style={subTextStyle}>
          This action cannot be undone.
        </p>

        <div style={buttonContainerStyle}>
          <button
            onClick={onClose}
            style={cancelButtonStyle}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            style={deleteButtonStyle}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const dialogStyle = {
  background: "#fff",
  borderRadius: "10px",
  padding: "24px",
  width: "400px",
  maxWidth: "90%",
  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
};

const titleStyle = {
  margin: 0,
  marginBottom: "16px",
  fontSize: "22px",
  fontWeight: 600,
};

const textStyle = {
  marginBottom: "8px",
  fontSize: "15px",
  color: "#374151",
};

const subTextStyle = {
  color: "#6b7280",
  fontSize: "14px",
  marginBottom: "24px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
};

const cancelButtonStyle = {
  padding: "10px 18px",
  border: "1px solid #d1d5db",
  background: "#fff",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

const deleteButtonStyle = {
  padding: "10px 18px",
  border: "none",
  background: "#dc2626",
  color: "#fff",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
};