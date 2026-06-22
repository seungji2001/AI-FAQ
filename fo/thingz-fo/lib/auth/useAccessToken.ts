"use client";

import { useSyncExternalStore } from "react";
import { subscribeToAuthChanges, tokenStorage } from "./token";

const getServerSnapshot = () => null;

export function useAccessToken(): string | null {
  return useSyncExternalStore(
    subscribeToAuthChanges,
    tokenStorage.getAccessToken,
    getServerSnapshot,
  );
}
