import { Header } from '@/components/header'
import cn from 'mxcn'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ask My Docs RAG',
  description: 'Ask any query about my docs. Built using Langbase.',
  keywords: ['AI', 'Chatbot', 'RAG', 'Docs', 'Langbase']
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'bg-background light')}>
        <div className="flex min-h-screen flex-col px-3 pr-0 pt-6">
          <div className="rounded-l-[calc(var(--radius)+2px)] border border-r-0 pb-1 pl-1">
            <Toaster />
            <Header />
            <main className="bg-muted rounded-l-[calc(var(--radius)+2px)]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
