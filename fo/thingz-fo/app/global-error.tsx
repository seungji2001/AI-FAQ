"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled application error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
          <div>
            <h1>문제가 발생했습니다</h1>
            <p>잠시 후 다시 시도해주세요.</p>
            <button type="button" onClick={reset}>다시 시도</button>
          </div>
        </main>
      </body>
    </html>
  );
}
