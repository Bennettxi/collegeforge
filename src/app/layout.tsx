import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { CollegeProvider } from "@/context/CollegeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollegeForge — Build Your Strongest College Application",
  description: "Track your progress, level up your avatar, and get personalized recommendations to stand out in college admissions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased bg-white text-gray-900`}>
        <AuthProvider>
          <ProfileProvider>
            <CollegeProvider>
              {children}
            </CollegeProvider>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
