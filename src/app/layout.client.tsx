"use client";

import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Head from "next/head";

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
