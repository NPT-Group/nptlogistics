// src/components/forms/rhf/FieldController.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";

export type FieldControllerProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  children: (args: ReturnType<typeof useController<TFieldValues>>) => React.ReactNode;
};

export function FieldController<TFieldValues extends FieldValues>({
  control,
  name,
  children,
}: FieldControllerProps<TFieldValues>) {
  const controller = useController({ control, name });
  return <>{children(controller)}</>;
}
