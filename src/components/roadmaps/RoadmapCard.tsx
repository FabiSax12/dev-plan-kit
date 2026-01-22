import { Link, useRouter } from "@tanstack/react-router"
import { Map, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { deleteRoadmap } from '@/server-functions/roadmaps'
import { LearningRoadmap } from '@/domain/LearningRoadmap'
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { DeleteItemDialog } from "../DeleteItemDialog"

type RoadmapCardProps = {
    roadmap: LearningRoadmap
}

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
    const router = useRouter()
    const progress = roadmap.getProgress()

    const deleteMutation = useMutation({
        mutationFn: deleteRoadmap,
        onSuccess: () => {
            router.invalidate({
                filter(d) {
                    return d.routeId === '/_app/roadmaps/'
                },
            })
        },
    })

    return (
        <Card className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
                <Link to="/roadmaps/$roadmapId" params={{ roadmapId: roadmap.getId().toString() }}>
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                            <Map className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold truncate">{roadmap.getName()}</h3>
                            {roadmap.getDescription() && (
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                    {roadmap.getDescription()}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{progress.completed} / {progress.total} completed</span>
                            <span>{progress.percentage}%</span>
                        </div>
                        <Progress value={progress.percentage} className="h-2" />
                    </div>
                </Link>

                <div className="mt-4 flex justify-between items-center pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                        Updated {roadmap.getUpdatedAt().toLocaleDateString()}
                    </p>
                    <DeleteItemDialog
                        triggerContent={(openModal) => (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={openModal}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        onConfirm={async () => {
                            toast.promise(
                                deleteMutation.mutateAsync({ data: { id: roadmap.getId() } }),
                                {
                                    loading: 'Deleting roadmap...',
                                    success: 'Roadmap deleted',
                                    error: 'Error deleting roadmap',
                                }
                            )
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
