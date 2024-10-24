import { buttonVariants } from '@/components/ui/button'
import cn from 'mxcn'
import Link from 'next/link'
import { IconDocs, IconFork, IconGitHub } from './ui/icons'

export async function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between px-4">
      <div className="flex h-16 shrink-0 items-center">
        <h1>
          <Link href="/" className="font-bold">
            <span
              aria-hidden="true"
              className="border-muted-foreground/10 bg-muted mr-1 select-none rounded-lg border px-[0.2rem] py-[0.1rem] text-sm font-bold shadow-2xl"
            >
              ⌘
            </span>
            Langbase
          </Link>
        </h1>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <a
          href="https://baseai.dev/docs"
          target="_blank"
          className={cn(buttonVariants({ variant: 'ghost' }))}
        >
          <IconDocs className="text-muted-foreground size-4" />
          <span className="hidden sm:flex">BaseAI: Build an agentic AI pipe with tools and memory</span>
        </a>
        <a
          target="_blank"
          href="https://github.com/LangbaseInc/baseai/tree/main/examples/agents/ask-my-text-documents-agent"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <IconGitHub />
          <span className="hidden md:flex">GitHub</span>
        </a>
        <a
          target="_blank"
          href="https://langbase.com/examples/ask-my-text-documents-agent"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          <IconFork />
          <span className="hidden gap-1 md:flex">
            Fork on <span className="font-bold">Langbase</span>
          </span>
        </a>
      </div>
    </header>
  )
}
