import type { Metadata } from "next";
import { Geist, Geist_Mono, Prompt, Sarabun } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import RootClientLayout from "./layout.client";

const sarabun = Sarabun({ subsets: ["latin"], weight: ["400", "700"] });
const prompt = Prompt({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Siam Centric Research System",
  description:
    "แบบสอบถามออนไลน์สำหรับเก็บข้อมูล ความคิดเห็น และข้อเสนอแนะ เพื่อการวิเคราะห์และประเมินผลอย่างมีประสิทธิภาพ",
  icons: {
    icon: "/images/contact-form.png",
    shortcut: "/images/contact-form.png",
    apple: "/images/contact-form.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={prompt.className}>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <ThemeProvider theme={theme}>{children}</ThemeProvider> */}
        {/* {children} */}
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}
