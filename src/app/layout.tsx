import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#10B981",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "স্মার্ট শিশু শিক্ষা | Smart Shishu Shikkha - AI Teacher & PWA",
  description:
    "শিশুদের সহজ, আনন্দময় ও ইন্টারঅ্যাকটিভ পদ্ধতিতে পড়াশোনা শিখতে সাহায্য করার জন্য তৈরি একটি শিক্ষামূলক অ্যাপ। Made by Mohammad Rakib.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "শিশু শিক্ষা",
  },
  icons: {
    icon: "/icons/app-logo.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <body className="min-h-dvh bg-emerald-50/40 text-slate-800 antialiased selection:bg-emerald-200">
        {children}
      </body>
    </html>
  );
}
