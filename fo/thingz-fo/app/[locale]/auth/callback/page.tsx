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

    router.replace("/");
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
