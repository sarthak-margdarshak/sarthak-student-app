"use client";

import { useContext } from "react";
import { AppContentContext } from "./AppContentProvider";

export const useAppContent = () => {
  const context = useContext(AppContentContext);

  if (!context)
    throw new Error(
      "useAppContent context must be used inside AppContentProvider"
    );

  return context;
};
