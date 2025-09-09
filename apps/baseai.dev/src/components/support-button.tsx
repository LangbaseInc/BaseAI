'use client';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';

export default function SupportButton() {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <a
                        href="https://langbase.com/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black shadow-lg transition-all duration-200 hover:scale-105"
                        aria-label="Contact Support"
                    >
                        <img
                            src="/favicon/svg-white/favicon.svg"
                            alt="Contact Support"
                            className="h-5 w-5"
                        />
                    </a>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Contact Support</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}