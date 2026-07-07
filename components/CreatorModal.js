"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateCreator } from "../hooks/useCreateCreator";
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