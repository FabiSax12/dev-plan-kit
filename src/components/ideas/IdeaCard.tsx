import { Link, useRouteContext, useRouter } from "@tanstack/react-router"
import { Lightbulb, Sparkles, FolderKanban, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { deleteIdea } from '@/server-functions/ideas'
import { Idea } from '@/domain/Idea'
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { DeleteItemDialog } from "../DeleteItemDialog"
import { createProject } from "@/server-functions/projects"
import { Dialog, DialogTrigger, DialogClose, DialogFooter, DialogContent } from "../ui/dialog"

export const IdeaCard = ({ idea }: { idea: Idea }) => {

    const router = useRouter();
    const userId = useRouteContext({ from: "__root__", select: (ctx) => ctx.user?.id! });

    const deleteIdeaMutation = useMutation({
        mutationFn: deleteIdea,
        onSuccess: (_, variables, __, context) => {
            context.client.invalidateQueries({ queryKey: ['ideas'] })
            context.client.invalidateQueries({ queryKey: ['ideas', variables.data.id] })

            router.invalidate({
                filter(d) {
                    return d.routeId === '/_app/ideas/' || d.fullPath === `/ideas/${variables.data.id}`
                },
            })
        },
    })

    const convertToProjectMutation = useMutation({

        mutationFn: async () => {
            const newProjectId = await createProject({
                data: {
                    name: idea.getTitle(),
                    description: idea.getDescription(),
                    projectType: 'personal',
                    status: 'planning',
                    userId: userId,
                }
            });

            await deleteIdeaMutation.mutateAsync({ data: { id: idea.getId().toString() } });

            return newProjectId;
        },

        onSuccess: (projectId) => {
            router.navigate({ to: '/projects/$projectId', params: { projectId: projectId.toString() } })
        },

        onError: (error) => {
            console.error('Error converting idea to project:', error);
        },
    })

    const handleConvertIdeaToProject = async () => {
        toast.promise(
            convertToProjectMutation.mutateAsync(),
            {
                loading: 'Converting idea to project...',
                success: 'Idea converted to project',
                error: 'Error converting idea to project',
            }
        )
    }

    return <Card key={idea.getId()} className="group">
        <CardContent className="p-5">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{idea.getTitle()}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{idea.getDescription()}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{idea.getCreatedAt().toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link to={`/ai-assistant`} search={{ idea: idea.getId() }}>
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                        Chat with AI
                    </Link>
                </Button>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <FolderKanban className="mr-1.5 h-3.5 w-3.5" />
                            Convert to Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <h3 className="text-lg font-medium mb-4">Convert Idea to Project</h3>
                        <p>Are you sure you want to convert this idea into a project? This action will create a new project based on the idea's details.</p>
                        <DialogFooter>
                            <Button
                                onClick={handleConvertIdeaToProject}
                            >
                                Confirm
                            </Button>
                            <DialogClose className="ml-2">
                                Cancel
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DeleteItemDialog
                    triggerContent={(openModal) =>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={openModal}
                        >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        </Button>
                    }
                    onConfirm={async () => {
                        toast.promise(
                            deleteIdeaMutation.mutateAsync({ data: { id: idea.getId().toString() } }),
                            {
                                loading: 'Deleting idea...',
                                success: 'Idea deleted',
                                error: 'Error deleting idea',
                                cancel: 'Delete idea cancelled',
                            }
                        )
                    }}
                />
            </div>
        </CardContent>
    </Card >
}