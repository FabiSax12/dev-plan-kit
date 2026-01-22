import { LearningPhase, LearningItemStatus } from '@/domain/LearningRoadmap'
import { PhaseColumn } from './PhaseColumn'
import { AddPhaseButton } from './AddPhaseButton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type RoadmapVisualizerProps = {
    phases: LearningPhase[]
    roadmapId: number
    onPhaseCreate: (name: string) => void
    onPhaseUpdate: (phaseId: number, data: { name?: string }) => void
    onPhaseDelete: (phaseId: number) => void
    onItemCreate: (phaseId: number, name: string) => void
    onItemUpdate: (itemId: number, data: { name?: string; status?: LearningItemStatus }) => void
    onItemDelete: (itemId: number) => void
}

export function RoadmapVisualizer({
    phases,
    onPhaseCreate,
    onPhaseUpdate,
    onPhaseDelete,
    onItemCreate,
    onItemUpdate,
    onItemDelete,
}: RoadmapVisualizerProps) {
    return (
        <div className="relative rounded-lg border bg-muted/30 p-6">
            <ScrollArea className="w-full">
                <div className="flex items-start gap-6 pb-4 min-h-100">
                    {/* Phases */}
                    {phases.map((phase, index) => (
                        <div key={phase.getId()} className="relative flex items-start">
                            <PhaseColumn
                                phase={phase}
                                phaseNumber={index + 1}
                                onUpdate={(data) => onPhaseUpdate(phase.getId(), data)}
                                onDelete={() => onPhaseDelete(phase.getId())}
                                onItemCreate={(name) => onItemCreate(phase.getId(), name)}
                                onItemUpdate={onItemUpdate}
                                onItemDelete={onItemDelete}
                            />

                            {/* Connector arrow to next phase */}
                            {index < phases.length - 1 && (
                                <div className="flex items-center self-center ml-3">
                                    <div className="w-6 h-0.5 bg-primary/40" />
                                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-primary/40" />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add phase button */}
                    <div className="flex items-start self-center">
                        {phases.length > 0 && (
                            <div className="flex items-center mr-3">
                                <div className="w-6 h-0.5 bg-border" />
                            </div>
                        )}
                        <AddPhaseButton onAdd={onPhaseCreate} />
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}
