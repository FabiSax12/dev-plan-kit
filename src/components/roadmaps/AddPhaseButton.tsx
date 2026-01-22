import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

type AddPhaseButtonProps = {
    onAdd: (name: string) => void
}

export function AddPhaseButton({ onAdd }: AddPhaseButtonProps) {
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
            <Card className="w-64 shrink-0 border-dashed">
                <CardContent className="p-4">
                    <div className="space-y-3">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Phase name..."
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAdd()
                                if (e.key === 'Escape') handleCancel()
                            }}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleAdd} className="flex-1">
                                <Check className="mr-1 h-3 w-3" />
                                Add
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Button
            variant="outline"
            className="h-auto w-64 shrink-0 flex-col gap-2 py-8 border-dashed hover:border-primary hover:bg-primary/5"
            onClick={() => setIsAdding(true)}
        >
            <Plus className="h-6 w-6" />
            <span>Add Phase</span>
        </Button>
    )
}
