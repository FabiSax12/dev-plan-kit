import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRoadmapById, createPhase, updatePhase, deletePhase, createItem, updateItem, deleteItem } from '@/server-functions/roadmaps'
import { LearningRoadmap, LearningPhase, LearningItem, LearningItemStatus } from '@/domain/LearningRoadmap'
import { RoadmapVisualizer } from '@/components/roadmaps/RoadmapVisualizer'
import { useMutation } from '@tanstack/react-query'
import { Progress } from '@/components/ui/progress'

export const Route = createFileRoute('/_app/roadmaps/$roadmapId/')({
    component: RouteComponent,
    loader: async ({ params }) => {
        const result = await getRoadmapById({ data: { id: params.roadmapId } })
        return result
    },
})

function RouteComponent() {
    const router = useRouter()
    const { roadmap: roadmapData, phases: phasesData, items: itemsData } = Route.useLoaderData()

    // Build domain objects
    const roadmap = LearningRoadmap.fromJSONData(roadmapData)
    const phases = phasesData.map(LearningPhase.fromJSONData)

    // Assign items to phases
    for (const phase of phases) {
        const phaseItems = itemsData
            .filter(item => item.phase_id === phase.getId())
            .map(LearningItem.fromJSONData)
        phase.setItems(phaseItems)
    }
    roadmap.setPhases(phases)

    const progress = roadmap.getProgress()

    // Mutations
    const createPhaseMutation = useMutation({
        mutationFn: createPhase,
        onSuccess: () => router.invalidate(),
    })

    const updatePhaseMutation = useMutation({
        mutationFn: updatePhase,
        onSuccess: () => router.invalidate(),
    })

    const deletePhaseMutation = useMutation({
        mutationFn: deletePhase,
        onSuccess: () => router.invalidate(),
    })

    const createItemMutation = useMutation({
        mutationFn: createItem,
        onSuccess: () => router.invalidate(),
    })

    const updateItemMutation = useMutation({
        mutationFn: updateItem,
        onSuccess: () => router.invalidate(),
    })

    const deleteItemMutation = useMutation({
        mutationFn: deleteItem,
        onSuccess: () => router.invalidate(),
    })

    const handlePhaseCreate = async (name: string) => {
        const maxOrder = Math.max(0, ...roadmap.getPhases().map(p => p.getOrderIndex()))
        await createPhaseMutation.mutateAsync({
            data: {
                roadmap_id: roadmap.getId(),
                name,
                order_index: maxOrder + 1,
            }
        })
    }

    const handlePhaseUpdate = async (phaseId: number, data: { name?: string }) => {
        await updatePhaseMutation.mutateAsync({
            data: { id: phaseId, ...data }
        })
    }

    const handlePhaseDelete = async (phaseId: number) => {
        await deletePhaseMutation.mutateAsync({ data: { id: phaseId } })
    }

    const handleItemCreate = async (phaseId: number, name: string) => {
        const phase = roadmap.getPhases().find(p => p.getId() === phaseId)
        const maxOrder = phase ? Math.max(0, ...phase.getItems().map(i => i.getOrderIndex())) : 0
        await createItemMutation.mutateAsync({
            data: {
                phase_id: phaseId,
                name,
                status: 'pending',
                order_index: maxOrder + 1,
            }
        })
    }

    const handleItemUpdate = async (itemId: number, data: { name?: string; status?: LearningItemStatus }) => {
        await updateItemMutation.mutateAsync({
            data: { id: itemId, ...data }
        })
    }

    const handleItemDelete = async (itemId: number) => {
        await deleteItemMutation.mutateAsync({ data: { id: itemId } })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-fit -ml-2 mb-2" asChild>
                        <Link to="/roadmaps">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Roadmaps
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-semibold">{roadmap.getName()}</h1>
                    {roadmap.getDescription() && (
                        <p className="text-muted-foreground">{roadmap.getDescription()}</p>
                    )}
                </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress.completed} / {progress.total} completed ({progress.percentage}%)</span>
                </div>
                <Progress value={progress.percentage} className="h-2" />
            </div>

            {/* Roadmap Visualizer */}
            <RoadmapVisualizer
                phases={roadmap.getPhases()}
                roadmapId={roadmap.getId()}
                onPhaseCreate={handlePhaseCreate}
                onPhaseUpdate={handlePhaseUpdate}
                onPhaseDelete={handlePhaseDelete}
                onItemCreate={handleItemCreate}
                onItemUpdate={handleItemUpdate}
                onItemDelete={handleItemDelete}
            />
        </div>
    )
}
