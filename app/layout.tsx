import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Movies Website - Discover Amazing Films",
  description: "Discover and watch the latest movies and popular films",
  icons: {
    icon: "/move-wepsite/icon/wepsite-icon.png",
    shortcut: "/move-wepsite/icon/wepsite-icon.png",
    apple: "/move-wepsite/icon/wepsite-icon.png",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
