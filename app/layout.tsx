import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ChampionProvider } from "@/lib/champion-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "행정안전부 AI챔피온 명예의 전당",
  description: "대한민국 공공분야 AI 챔피온들을 기념하는 디지털 명예의 전당",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ChampionProvider>{children}</ChampionProvider>
      </body>
    </html>
  )
}
