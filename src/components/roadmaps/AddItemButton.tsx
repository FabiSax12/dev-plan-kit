import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type AddItemButtonProps = {
    onAdd: (name: string) => void
}

export function AddItemButton({ onAdd }: AddItemButtonProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [name, setName] = useState('')

    const handleAdd = () => {
        if (name.trim()) {
            onAdd(name.trim())
            setName('')
            setIsAdding(false)
        }
    }

    const handleCancel = () => {
        setName('')
        setIsAdding(false)
    }

    if (isAdding) {
        return (
            <div className="flex items-center gap-1 p-2 rounded-lg border border-dashed bg-background">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Item name..."
                    className="h-7 text-sm flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAdd()
                        if (e.key === 'Escape') handleCancel()
                    }}
                />
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleAdd}>
                    <Check className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCancel}>
                    <X className="h-3 w-3" />
                </Button>
            </div>
        )
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground border border-dashed"
            onClick={() => setIsAdding(true)}
        >
            <Plus className="mr-1 h-3 w-3" />
            Add item
        </Button>
    )
}
