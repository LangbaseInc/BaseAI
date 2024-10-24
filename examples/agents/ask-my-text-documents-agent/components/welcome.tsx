import { IconDocs } from './ui/icons'

export const Welcome = () => {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-y-4">
      <h2 className="flex gap-4 font-mono text-2xl font-semibold tracking-wide sm:text-5xl">
        <IconDocs className="rotate-30 size-12" />
        Ask My Text Documents Agent
      </h2>
      <span className="text-muted-foreground w-full text-center leading-7 sm:w-2/3">
      Ask My Text Documents Agent example is built with BaseAI framework that enables question and answering from your docs
        using Langbase agentic Pipes and Memory. The example supports conversation with .pdf, .txt, .md format. 
      </span>
    </div>
  )
}
