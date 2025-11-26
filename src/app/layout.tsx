import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Shreeji Enterprise Services - Manpower Supply & Recruitment",
  description: "Leading manpower supply company providing delivery personnel, BPO staff, and IT recruitment services across India and globally.",
  keywords: "manpower supply, recruitment, delivery boys, BPO jobs, IT recruitment, Rajkot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
