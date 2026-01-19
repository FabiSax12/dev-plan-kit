import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createIdea } from '@/server-functions/ideas'
import { useAppForm } from '@/components/custom-form/context'
import { Idea } from '@/domain/Idea'

export const Route = createFileRoute('/_app/ideas/new/')({
  component: RouteComponent,
})

export function RouteComponent() {
  const router = useRouter()
  const userId = Route.useRouteContext().user?.id!

  const form = useAppForm({
    validators: {
      onChange: Idea._schemas.createIdeaSchema,
    },
    defaultValues: {
      title: '',
      description: '',
      user_id: userId,
    },
    onSubmit: async ({ value }) => {
      await createIdea({ data: { ...value } })
      router.navigate({ to: "/ideas" })
    }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link to="/ideas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ideas
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Capture a New Idea</CardTitle>
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
              <form.AppField name='title'>
                {(field) => <field.InputField
                  label='Title'
                  placeholder='My Idea'
                />}
              </form.AppField>
            </div>

            <div className="space-y-2">
              <form.AppField name='description'>
                {(field) => <field.TextAreaField
                  label='Description / Notes'
                  placeholder='Brainstorm. Describe your idea, jot down notes, features you re thinking about...'
                  rows={6}
                />}
              </form.AppField>
            </div>

            <div className="flex gap-3 pt-4">

              <form.AppForm>
                <form.SubmitButton>Save Idea</form.SubmitButton>
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
