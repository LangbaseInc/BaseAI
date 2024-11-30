import { Button } from '@/components/ui/button'
import { IconChat, IconCommand, IconSpinner } from '@/components/ui/icons'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import * as React from 'react'
import Textarea from 'react-textarea-autosize'

export interface PromptProps {
  onSubmit: (value: string) => Promise<void>
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  handleInputChange,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="bg-background relative flex max-h-60 w-full grow flex-col overflow-hidden px-2 pb-2 sm:rounded-2xl sm:border">
        <div className="flex w-full flex-col">
          <label
            htmlFor="playground"
            className="text-config text-foreground flex justify-between gap-y-4 rounded-xl px-3 py-4 font-medium leading-6 md:flex-row md:items-center md:gap-y-0"
          >
            <div className="flex items-center gap-x-2">
              <IconChat
                className="text-muted-foreground/50 size-5"
                aria-hidden="true"
              />
              <h3>Ask</h3>
            </div>

            <div className="flex items-center justify-center gap-2 md:justify-start">
              <Button
                variant="ghost"
                className="max-w-xs"
                onClick={e => {
                  e.preventDefault()
                  location.reload()
                }}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isLoading || input === ''}>
                {isLoading ? (
                  <IconSpinner />
                ) : (
                  <IconCommand className="size-4" />
                )}
                Send
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </label>
        </div>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          maxRows={10}
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your prompt query..."
          spellCheck={false}
          className="bg-muted min-h-[60px] w-full resize-none rounded-lg px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
      </div>
    </form>
  )
}
