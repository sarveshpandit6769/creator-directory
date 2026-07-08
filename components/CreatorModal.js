"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateCreator } from "../hooks/useCreateCreator";
import { useUpdateCreator } from "../hooks/useUpdateCreator";

const NICHES = ["beauty", "fitness", "travel", "food", "tech", "fashion"];

// Reusable field wrapper — wraps label + input + error message together
function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{
          display: "block",
          marginBottom: "5px",
          fontSize: "13px",
          fontWeight: 600,
          color: "#374151",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p style={{ color: "#dc2626", fontSize: "12px", margin: "4px 0 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function CreatorModal({ creator, onClose }) {
  const isEditing = Boolean(creator);
  const createMutation = useCreateCreator();
  const updateMutation = useUpdateCreator();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      niche: "",
      email: "",
      followerCount: "",
      engagementRate: "",
      status: "active",
    },
  });

  // Pre-fill form when editing an existing creator
  useEffect(() => {
    if (creator) {
      reset({
        name: creator.name,
        niche: creator.niche,
        email: creator.email,
        followerCount: creator.followerCount,
        engagementRate: creator.engagementRate,
        status: creator.status,
      });
    } else {
      reset({
        name: "",
        niche: "",
        email: "",
        followerCount: "",
        engagementRate: "",
        status: "active",
      });
    }
  }, [creator, reset]);

  async function onSubmit(values) {
    const payload = {
      ...values,
      followerCount: Number(values.followerCount),
      engagementRate: Number(values.engagementRate),
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: creator.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      console.error("Save failed:", err);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#111827" }}>
            {isEditing ? "Edit Creator" : "Add New Creator"}
          </h2>
          <button onClick={onClose} style={closeBtnStyle} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <Field label="Name *" error={errors.name?.message}>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="e.g. Priya Sharma"
              style={inputStyle(!!errors.name)}
            />
          </Field>

          {/* Email */}
          <Field label="Email *" error={errors.email?.message}>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              placeholder="e.g. priya@example.com"
              style={inputStyle(!!errors.email)}
            />
          </Field>

          {/* Niche */}
          <Field label="Niche *" error={errors.niche?.message}>
            <select
              {...register("niche", { required: "Niche is required" })}
              style={inputStyle(!!errors.niche)}
            >
              <option value="">Select a niche</option>
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {n.charAt(0).toUpperCase() + n.slice(1)}
                </option>
              ))}
            </select>
          </Field>

          {/* Two columns: Follower Count + Engagement Rate */}
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <Field label="Follower Count" error={errors.followerCount?.message}>
                <input
                  type="number"
                  min="0"
                  {...register("followerCount", {
                    required: "Follower count is required",
                    min: { value: 0, message: "Must be 0 or more" },
                  })}
                  placeholder="e.g. 45200"
                  style={inputStyle(!!errors.followerCount)}
                />
              </Field>
            </div>

            <div style={{ flex: 1 }}>
              <Field label="Engagement Rate (%)" error={errors.engagementRate?.message}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  {...register("engagementRate", {
                    required: "Engagement rate is required",
                    min: { value: 0, message: "Min is 0" },
                    max: { value: 100, message: "Max is 100" },
                  })}
                  placeholder="e.g. 3.8"
                  style={inputStyle(!!errors.engagementRate)}
                />
              </Field>
            </div>
          </div>

          {/* Status */}
          <Field label="Status" error={errors.status?.message}>
            <select
              {...register("status", { required: "Status is required" })}
              style={inputStyle(!!errors.status)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>

          {/* Show mutation error if API call failed */}
          {(createMutation.isError || updateMutation.isError) && (
            <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "12px" }}>
              Something went wrong. Please try again.
            </p>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              style={cancelBtnStyle}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={submitBtnStyle(isPending)}
            >
              {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Creator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "16px",
};

const modalStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "28px",
  width: "100%",
  maxWidth: "520px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  color: "#6b7280",
  padding: "4px 8px",
  borderRadius: "4px",
  lineHeight: 1,
};

// inputStyle is a function so we can highlight fields with errors
function inputStyle(hasError) {
  return {
    width: "100%",
    padding: "9px 12px",
    border: `1px solid ${hasError ? "#dc2626" : "#d1d5db"}`,
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
    color: "#111827",
  };
}

const cancelBtnStyle = {
  padding: "9px 20px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  background: "#fff",
  fontSize: "14px",
  cursor: "pointer",
  color: "#374151",
};

function submitBtnStyle(isPending) {
  return {
    padding: "9px 20px",
    border: "none",
    borderRadius: "6px",
    background: isPending ? "#93c5fd" : "#3b82f6",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: isPending ? "not-allowed" : "pointer",
  };
}
