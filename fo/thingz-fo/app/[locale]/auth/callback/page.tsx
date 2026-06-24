"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tokenStorage } from "@/lib/auth/token";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      tokenStorage.setTokens(accessToken, refreshToken);
    }

    const returnLocale = document.cookie
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("auth_return_locale="))
      ?.split("=")[1];
    document.cookie = "auth_return_locale=; path=/; max-age=0; SameSite=Lax";
    const locale = returnLocale === "en" || returnLocale === "ja" ? returnLocale : "ko";
    router.replace(`/${locale}`);
  }, [params, router]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CircularProgress />
    </Box>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><CircularProgress /></Box>}>
      <AuthCallback />
    </Suspense>
  );
}
