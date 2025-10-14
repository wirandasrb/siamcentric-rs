"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import Head from "next/head";
import { usePathname } from "next/navigation";

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSurveyPage = pathname?.startsWith("/surveys/");

  if (isSurveyPage) {
    // ❌ ไม่ใช้ ThemeProvider global สำหรับ survey
    return children;
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
