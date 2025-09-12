// FILE: src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

// 1. Import the new components
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import SessionWarning from "@/components/auth/SessionWarning";
import FloatingMessageButton from "@/components/messaging/FloatingMessageButton";

export const metadata: Metadata = {
  title: "CamOrphanage",
  description: "Connecting support organizations with orphanages in Cameroon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthSessionProvider>
          {/* 2. Add the Navbar and Footer */}
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <SessionWarning />
          <FloatingMessageButton />
        </AuthSessionProvider>
      </body>
    </html>
  );
}