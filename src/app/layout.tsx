import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { CollegeProvider } from "@/context/CollegeContext";
import { StreakProvider } from "@/context/StreakContext";
import { DocumentProvider } from "@/context/DocumentContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollegeSprout — Build Your Strongest College Application",
  description: "Track your progress, level up your avatar, and get personalized recommendations to stand out in college admissions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const t = localStorage.getItem('collegesprout_theme');
            if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          } catch(e) {}
        `}} />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased bg-[#fafbfe] dark:bg-[#0f0f1a] text-gray-900 dark:text-gray-100 transition-colors`}>
        <ThemeProvider>
          <AuthProvider>
            <ProfileProvider>
              <CollegeProvider>
                <StreakProvider>
                  <DocumentProvider>
                    <SubscriptionProvider>
                      {children}
                    </SubscriptionProvider>
                  </DocumentProvider>
                </StreakProvider>
              </CollegeProvider>
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
