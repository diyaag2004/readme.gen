import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "README Generator for GitHub Repositories with AI",
  description: "Automate your README files with our AI enabled website. Generate high-quality READMEs for your GitHub repositories with ease.",
  keywords: [
    "README generator",
    "GitHub repository",
    "Next.js app",
    "automate README",
    "high-quality README",
    "GitHub repo",
    "open-source",
    "developer tools",
    "AI Readme generator"
  ],
  author: "Diya Agrawal",
  robots: "index, follow",
  og: {
    title: "README Generator for GitHub Repositories ",
    description: "Automate your README files with our Next.js app. Generate high-quality READMEs for your GitHub repositories with ease.",
    url: "https://readme-generator-ai.vercel.app/",
    type: "website"
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
