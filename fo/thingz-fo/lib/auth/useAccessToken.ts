"use client";

import { useSyncExternalStore } from "react";
import { subscribeToAuthChanges, tokenStorage } from "./token";

const getServerSnapshot = () => null;
const subscribeToHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

export function useAccessToken(): string | null {
  return useSyncExternalStore(
    subscribeToAuthChanges,
    tokenStorage.getAccessToken,
    getServerSnapshot,
  );
}

export function useAuthState(): { accessToken: string | null; isHydrated: boolean } {
  const accessToken = useAccessToken();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );

  return { accessToken, isHydrated };
}
