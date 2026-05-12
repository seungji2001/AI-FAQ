"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { fs } from "@/lib/styles/typography";

type Severity = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  message: string;
  severity: Severity;
}

interface ToastContextValue {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warn: (msg: string) => void;
    info: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue>({
  toast: { success: () => {}, error: () => {}, warn: () => {}, info: () => {} },
});

let _id = 0;

const DURATION: Record<Severity, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, severity: Severity) => {
    const id = ++_id;
    setItems((prev) => [...prev.slice(-2), { id, message, severity }]);
  }, []);

  const close = (id: number) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const toast = {
    success: (msg: string) => show(msg, "success"),
    error:   (msg: string) => show(msg, "error"),
    warn:    (msg: string) => show(msg, "warning"),
    info:    (msg: string) => show(msg, "info"),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {items.map((item, i) => (
        <Snackbar
          key={item.id}
          open
          autoHideDuration={DURATION[item.severity]}
          onClose={() => close(item.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{ bottom: { xs: 16 + i * 60, sm: 24 + i * 60 } }}
        >
          <Alert
            severity={item.severity}
            onClose={() => close(item.id)}
            variant="filled"
            sx={{
              fontSize: fs.sm,
              borderRadius: 2,
              boxShadow: 3,
              minWidth: 260,
              maxWidth: 480,
              alignItems: "center",
              "& .MuiAlert-message": { py: 0 },
            }}
          >
            {item.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue["toast"] {
  return useContext(ToastContext).toast;
}
