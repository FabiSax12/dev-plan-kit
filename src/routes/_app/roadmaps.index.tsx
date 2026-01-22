import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRoadmaps } from '@/server-functions/roadmaps'
import { LearningRoadmap } from '@/domain/LearningRoadmap'
import { RoadmapCard } from '@/components/roadmaps/RoadmapCard'

export const Route = createFileRoute('/_app/roadmaps/')({
    component: RouteComponent,
    loader: async () => ({
        roadmapsData: await getRoadmaps(),
    }),
})

function RouteComponent() {
    const { roadmapsData } = Route.useLoaderData();
    const roadmaps = roadmapsData.map(LearningRoadmap.fromJSONData);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold">Learning Roadmaps</h1>
                <Button asChild>
                    <Link to="/roadmaps/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Roadmap
                    </Link>
                </Button>
            </div>

            {roadmaps.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {roadmaps.map((roadmap) => (
                        <RoadmapCard key={roadmap.getId()} roadmap={roadmap} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
                    <Map className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">No roadmaps yet</p>
                    <Button variant="link" asChild className="mt-2">
                        <Link to="/roadmaps/new">Create your first learning roadmap</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
