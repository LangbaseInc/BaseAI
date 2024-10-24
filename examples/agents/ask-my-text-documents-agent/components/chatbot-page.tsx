'use client'

import React, { useState } from 'react';
import { usePipe } from '@baseai/core/react';
import cn from 'mxcn';
import { toast } from 'sonner';
import { Message } from '@baseai/core/pipes';
import { ChatList } from '@/components/chat-list';
import { ChatInput } from './chat-input';
import { Opening } from './opening';
import { Welcome } from './welcome';
import { Suggestions } from './suggestions';

export interface ChatProps extends React.ComponentProps<'div'> {
  id?: string;
  initialMessages?: Message[];
}

export function Chatbot({ id, initialMessages, className }: ChatProps) {
  const [threadId, setThreadId] = useState<string | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    regenerate,
    stop,
    sendMessage,
  } = usePipe({
    stream: true,
    apiRoute: '/api/chat',
    initialMessages,
    onResponse: (message) => {
      console.log('Full response:', message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const sendSuggestedPrompt = (prompt: string) => {
    handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="min-h-screen">
      <div className={cn('pb-36 pt-4 md:pt-10', className)}>
        {messages.length ? (
          <ChatList messages={messages} />
        ) : (
          <>
            <Welcome />
            <Opening />
            <Suggestions sendSuggestedPrompt={sendSuggestedPrompt} />
          </>
        )}
      </div>
      <ChatInput
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={sendMessage}
        reload={regenerate}
        messages={messages}
        input={input}
        setInput={handleInputChange}
      />
    </div>
  );
}
