import { useState } from 'react'
import { LearningPhase, LearningItemStatus } from '@/domain/LearningRoadmap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Pencil, Trash2, Check, X } from 'lucide-react'
import { RoadmapItem } from './RoadmapItem'
import { AddItemButton } from './AddItemButton'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteItemDialog } from '../DeleteItemDialog'
import { toast } from 'sonner'

type PhaseColumnProps = {
    phase: LearningPhase
    phaseNumber: number
    onUpdate: (data: { name?: string }) => void
    onDelete: () => void
    onItemCreate: (name: string) => void
    onItemUpdate: (itemId: number, data: { name?: string; status?: LearningItemStatus }) => void
    onItemDelete: (itemId: number) => void
}

export function PhaseColumn({
    phase,
    phaseNumber,
    onUpdate,
    onDelete,
    onItemCreate,
    onItemUpdate,
    onItemDelete,
}: PhaseColumnProps) {
    const items = phase.getItems()
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState(phase.getName())

    const handleSaveEdit = () => {
        if (editName.trim()) {
            onUpdate({ name: editName.trim() })
            setIsEditing(false)
        }
    }

    const handleCancelEdit = () => {
        setEditName(phase.getName())
        setIsEditing(false)
    }

    return (
        <Card className="w-64 shrink-0 bg-card shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                    {isEditing ? (
                        <div className="flex items-center gap-1 flex-1">
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-7 text-sm"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit()
                                    if (e.key === 'Escape') handleCancelEdit()
                                }}
                            />
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSaveEdit}>
                                <Check className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancelEdit}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                    {phaseNumber}
                                </span>
                                <CardTitle className="text-sm font-medium truncate">{phase.getName()}</CardTitle>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DeleteItemDialog
                                        triggerContent={(openModal) => (
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onSelect={(e) => {
                                                    e.preventDefault()
                                                    openModal()
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        )}
                                        onConfirm={() => {
                                            toast.promise(
                                                Promise.resolve(onDelete()),
                                                {
                                                    loading: 'Deleting phase...',
                                                    success: 'Phase deleted',
                                                    error: 'Error deleting phase',
                                                }
                                            )
                                        }}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-2 pt-0">
                {/* Items stacked vertically (parallel items in same phase) */}
                {items.map((item) => (
                    <RoadmapItem
                        key={item.getId()}
                        item={item}
                        onUpdate={(data) => onItemUpdate(item.getId(), data)}
                        onDelete={() => onItemDelete(item.getId())}
                    />
                ))}

                <AddItemButton onAdd={onItemCreate} />
            </CardContent>
        </Card>
    )
}
