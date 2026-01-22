import { useState } from 'react'
import { LearningItem, LearningItemStatus } from '@/domain/LearningRoadmap'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Circle, Clock, CheckCircle2, Pencil, Trash2, Check, X } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteItemDialog } from '../DeleteItemDialog'
import { toast } from 'sonner'

const statusConfig: Record<LearningItemStatus, {
    icon: typeof Circle
    label: string
    iconClass: string
}> = {
    pending: {
        icon: Circle,
        label: 'Pending',
        iconClass: 'text-muted-foreground',
    },
    in_progress: {
        icon: Clock,
        label: 'In Progress',
        iconClass: 'text-yellow-500',
    },
    completed: {
        icon: CheckCircle2,
        label: 'Completed',
        iconClass: 'text-green-500',
    },
}

type RoadmapItemProps = {
    item: LearningItem
    onUpdate: (data: { name?: string; status?: LearningItemStatus }) => void
    onDelete: () => void
}

export function RoadmapItem({ item, onUpdate, onDelete }: RoadmapItemProps) {
    const status = item.getStatus()
    const config = statusConfig[status]
    const StatusIcon = config.icon

    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState(item.getName())

    const cycleStatus = () => {
        const statusOrder: LearningItemStatus[] = ['pending', 'in_progress', 'completed']
        const currentIndex = statusOrder.indexOf(status)
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
        onUpdate({ status: nextStatus })
    }

    const handleSaveEdit = () => {
        if (editName.trim()) {
            onUpdate({ name: editName.trim() })
            setIsEditing(false)
        }
    }

    const handleCancelEdit = () => {
        setEditName(item.getName())
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <div className="flex items-center gap-1 p-2 rounded-lg border bg-background">
                <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-7 text-sm flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit()
                        if (e.key === 'Escape') handleCancelEdit()
                    }}
                />
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleSaveEdit}>
                    <Check className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCancelEdit}>
                    <X className="h-3 w-3" />
                </Button>
            </div>
        )
    }

    return (
        <div
            className={cn(
                "group relative p-3 rounded-lg border bg-background transition-all hover:shadow-sm",
                status === 'completed' && "opacity-70"
            )}
        >
            <div className="flex items-start gap-2">
                <button
                    onClick={cycleStatus}
                    className="shrink-0 mt-0.5 hover:scale-110 transition-transform"
                    title={`Click to change status (current: ${config.label})`}
                >
                    <StatusIcon className={cn("h-4 w-4 transition-colors", config.iconClass)} />
                </button>

                <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-sm font-medium",
                        status === 'completed' && "line-through text-muted-foreground"
                    )}>
                        {item.getName()}
                    </p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        >
                            <MoreHorizontal className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onUpdate({ status: 'pending' })}>
                            <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
                            Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdate({ status: 'in_progress' })}>
                            <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                            Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdate({ status: 'completed' })}>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
                                        loading: 'Deleting item...',
                                        success: 'Item deleted',
                                        error: 'Error deleting item',
                                    }
                                )
                            }}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
