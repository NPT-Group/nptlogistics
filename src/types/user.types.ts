// src/types/user.types.ts
export interface IUser {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
  // roles?: string[];
}
