"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateCreators } from "../hooks/useCreateCreators";
import { useUpdateCreator } from "../hooks/useUpdateCreator";

const NICHES = ["beauty", "fitness", "travel", "food", "tech", "fashion"];

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

  // Pre-fill form when editing
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
            {isEditing ? "Edit Creator" : "Add New Creator"}
          </h2>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <Field label="Name" error={errors.name?.message}></Field>
          <input
            {...register("name", { required: "Name is required" })}
            style={inputStyle}
          />
          {/* Email */}
          <Field label="Email" error={errors.email?.message}></Field>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
            
            style={inputStyle}

          />

          {/* Follower Count */}
          <Field label="Follower Count" error={errors.followerCount?.message}></Field>
          <input
            type="number"
            {...register("followerCount", {
              required: "Follower count is required",
              min: { value: 0, message: "Must be positive" },
            })}
            style={inputStyle}

          />

          {/* Engagement Rate */}
          <Field label="Engagement Rate (%)" error={errors.engagementRate?.message}></Field>
          <input
            type="number"
            {...register("engagementRate", {
              required: "Engagement rate is required",
              min: { value: 0, message: "Must be positive" },
              max: { value: 100, message: "Max value is 100" },
            })}
            style={inputStyle}

          />

          {/* Niche */}
          <Field label="Niche" error={errors.niche?.message}></Field>
          <select
            {...register("niche", { required: "Niche is required" })}
            style={inputStyle}

          >
            <option value="">Select a niche</option>
            {NICHES.map((niche) => (
              <option key={niche} value={niche}>
                {niche}
              </option>
            ))}
          </select>

          {/* Status */}
          <Field label="Status" error={errors.status?.message}></Field>
          <select
            {...register("status", { required: "Status is required" })}
            style={inputStyle}

          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              type="submit"
              disabled={isPending}
              style={{ ...btnStyle, backgroundColor: "#007bff" }}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ ...btnStyle, backgroundColor: "#6c757d" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
const Field = ({ label, error, children }) => (
  <div style={{ marginBottom: "10px" }}>
    <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: 500 }}>
      {label}
    </label>
    {children}
    {error && <p style={{ color: "red", fontSize: "12px", margin: 0 }}>{error}</p>}
  </div>
);