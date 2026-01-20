import { ArrowUp, Library } from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Dispatch, SetStateAction, useState } from "react"

const PROMPT_MAX_LENGTH = 2000;

interface AIChatInputBoxProps {
    children?: React.ReactNode
    suggestionCards?: (setPrompt: Dispatch<SetStateAction<string>>) => React.ReactNode
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
    placeholder?: string
    disabled?: boolean
    name?: string
}

export const AIChatInputBox = ({ onSubmit, suggestionCards, placeholder, disabled, name }: AIChatInputBoxProps) => {
    const [prompt, setPrompt] = useState("");

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length > PROMPT_MAX_LENGTH) {
            setPrompt(e.target.value.slice(0, PROMPT_MAX_LENGTH));
            return;
        };

        setPrompt(e.target.value);
    }

    return (
        <div className="w-2/3 mx-auto">
            {/* Suggestions */}
            <div className="mb-4 grid grid-cols-2 grid-flow-row gap-2">
                {suggestionCards?.(setPrompt)}
            </div>

            <form
                className="rounded-2xl border border-border p-4 space-y-4"
                onSubmit={onSubmit}
            >
                <div className="max-h-40 overflow-y-auto">
                    <Textarea
                        name={name}
                        className="resize-none border-0 dark:bg-background p-0 focus:ring-0 focus-visible:ring-0 shadow-none rounded-none"
                        placeholder={placeholder}
                        value={prompt}
                        onChange={handlePromptChange}
                        rows={3}
                        maxLength={PROMPT_MAX_LENGTH}
                        disabled={disabled}
                    />
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div>
                        <Button size="sm">
                            <Library />
                            Templates
                        </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-secondary-foreground">
                            {prompt.length} / {PROMPT_MAX_LENGTH}
                        </span>
                        <Button type="submit" size="icon-sm" className="cursor-pointer" disabled={disabled}>
                            <ArrowUp />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </div>
            </form>


        </div>
    )
}

interface AIChatSuggestionBadgeProps {
    children: React.ReactNode
    onClick?: () => void
}

export const AIChatSuggestionBadge = ({ children, onClick }: AIChatSuggestionBadgeProps) => {
    return (
        <div className="text-xs font-light cursor-pointer text-wrap bg-secondary px-4 py-2 rounded-md" onClick={onClick}>
            {children}
        </div>
    )
}