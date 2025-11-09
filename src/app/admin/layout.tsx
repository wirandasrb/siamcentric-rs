"use client";
import { Metadata } from "next";
import AdminWithLayout from "../../components/AdminWithLayout";
import { Prompt, Sarabun } from "next/font/google";
import { usePathname } from "next/navigation";

// export const metadata: Metadata = {
//   title: "Siam Centric Research System",
//   description:
//     "แบบสอบถามออนไลน์สำหรับเก็บข้อมูล ความคิดเห็น และข้อเสนอแนะ เพื่อการวิเคราะห์และประเมินผลอย่างมีประสิทธิภาพ",
//   icons: { icon: "/images/contact-form.png" },
// };

// const sarabun = Sarabun({ subsets: ["latin"], weight: ["400", "700"] });
// const prompt = Prompt({ subsets: ["latin"], weight: ["400", "700"] });

export default function AdminServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPreviewPage = pathname?.includes("/preview");

  if (isPreviewPage) {
    // ❌ ไม่ใช้ layout ของ admin สำหรับ preview
    return <>{children}</>;
  }
  return <AdminWithLayout>{children}</AdminWithLayout>;
}
