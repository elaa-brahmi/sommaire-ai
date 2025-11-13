import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";


const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});



export const metadata: Metadata = {
  title: "sommaire",
  description: "sommaire is an app for summarizing pdf articles",
  openGraph:{
    images:[
      {
        url: '/nextjsOpenImg.jpg',
        width: 1200,
        height: 630,
        alt: 'Sommaire - PDF Article Summarizer'
      },
    ]
  },
  metadataBase:new URL('https://ai-saas-git-main-elaa-brahmis-projects.vercel.app/'),
  alternates:{
    canonical:'https://ai-saas-git-main-elaa-brahmis-projects.vercel.app/',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${fontSans.variable} font-sans antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header/>
          <main className="flex-1">{children}</main>
          
          <Footer/>
        </div>
        <Toaster/>
      </body>
    </html></ClerkProvider>
  );
}
