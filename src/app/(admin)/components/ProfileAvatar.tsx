// src/app/(admin)/components/shared/ProfileAvatar.tsx
"use client";

import { UserCircle2 } from "lucide-react";
import { AdminImage } from "@/components/media/AdminImage";
import type { IUser } from "@/types/user.types";

interface ProfileAvatarProps {
  user: Partial<IUser>;
  size?: number; // default 32
}

export default function ProfileAvatar({ user, size = 32 }: ProfileAvatarProps) {
  const userImage = user?.picture;

  if (userImage) {
    return (
      <AdminImage
        src={userImage}
        alt={user?.name || "User Profile"}
        width={size}
        height={size}
        className="rounded-full border border-slate-300 object-cover"
      />
    );
  }

  return <UserCircle2 width={size} height={size} className="text-slate-400" aria-hidden="true" />;
}
