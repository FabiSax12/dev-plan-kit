import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createRoadmap } from '@/server-functions/roadmaps'
import { useAppForm } from '@/components/custom-form/context'
import { LearningRoadmap } from '@/domain/LearningRoadmap'

export const Route = createFileRoute('/_app/roadmaps/new/')({
    component: RouteComponent,
})

function RouteComponent() {
    const router = useRouter()
    const userId = Route.useRouteContext().user?.id!

    const form = useAppForm({
        validators: {
            onChange: LearningRoadmap._schemas.createRoadmapSchema,
        },
        defaultValues: {
            name: '',
            user_id: userId,
            description: '',
        },
        onSubmit: async ({ value }) => {
            const roadmap = await createRoadmap({ data: { ...value } })
            router.navigate({ to: "/roadmaps/$roadmapId", params: { roadmapId: roadmap.id.toString() } })
        }
    });

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" size="sm" className="w-fit" asChild>
                <Link to="/roadmaps">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Roadmaps
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Create Learning Roadmap</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        id={form.formId}
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <form.AppField name='name'>
                                {(field) => <field.InputField
                                    label='Name'
                                    placeholder='Frontend Development'
                                />}
                            </form.AppField>
                        </div>

                        <div className="space-y-2">
                            <form.AppField name='description'>
                                {(field) => <field.TextAreaField
                                    label='Description (optional)'
                                    placeholder='A roadmap to master frontend development skills...'
                                    rows={4}
                                />}
                            </form.AppField>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <form.AppForm>
                                <form.SubmitButton>Create Roadmap</form.SubmitButton>
                            </form.AppForm>

                            <Button type="button" variant="outline" onClick={() => router.history.back()}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
