import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@radix-ui/react-label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useMutation } from '@tanstack/react-query'
import { createProject, createProjectSchema } from '@/server-functions/projects'
import z from 'zod'
import { useForm } from '@tanstack/react-form'

export const Route = createFileRoute('/_app/projects/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const userId = Route.useRouteContext().user?.id!;
  const [techInput, setTechInput] = useState("")

  const createProjectMutation = useMutation({
    mutationFn: async (newProjectData: z.infer<typeof createProjectSchema>) => await createProject({
      data: newProjectData
    }),
  });

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      project_type: 'personal' as 'personal' | 'work',
      status: 'planning' as 'planning' | 'in_development' | 'completed' | 'on_hold',
      production_url: '',
      repository_url: '',
      tech_stack: [] as string[],
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted with value:', value);
      await createProjectMutation.mutateAsync({ ...value, user_id: userId });
      router.navigate({ to: "/projects" })
    },
  })

  const addTech = () => {
    if (techInput && !form.getFieldValue("tech_stack").includes(techInput)) {
      form.setFieldValue("tech_stack", [...form.getFieldValue("tech_stack"), techInput.trim()])
    }
    setTechInput("")
  }

  const removeTech = (tech: string) => {
    form.setFieldValue("tech_stack", form.getFieldValue("tech_stack").filter(t => t !== tech))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link to="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <form.Field
              name='name'
              children={(field) => <div className="space-y-2">
                <Label htmlFor={field.name}>Project Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  placeholder="My Awesome Project" required
                />
              </div>}
            />

            <form.Field
              name='description'
            >
              {
                (field) => <div className="space-y-2">
                  <Label htmlFor={field.name}>Description</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    placeholder="Describe your project..." rows={3}
                  />
                </div>
              }
            </form.Field>

            <form.Field
              name='project_type'
            >
              {
                (field) => <div className="space-y-3">
                  <Label>Project Type</Label>
                  <RadioGroup defaultValue={field.state.value} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="personal" id="personal" />
                      <Label htmlFor="personal" className="font-normal cursor-pointer">
                        Personal
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="client" id="client" />
                      <Label htmlFor="client" className="font-normal cursor-pointer">
                        Client Work
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              }
            </form.Field>

            <form.Field
              name='status'
            >
              {
                (field) => <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={field.state.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in_development">In Development</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              }
            </form.Field>

            <form.Field
              name='production_url'
            >
              {
                (field) => <div className="space-y-2">
                  <Label htmlFor={field.name}>Project URL</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    type="url"
                    placeholder="https://myproject.com"
                  />
                </div>
              }
            </form.Field>

            <form.Field
              name='repository_url'
            >
              {
                (field) => <div className="space-y-2">
                  <Label htmlFor={field.name}>Repository Link</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    type="url"
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              }
            </form.Field>

            <form.Field
              name='tech_stack'
            >
              {
                (field) => <div className="space-y-2">
                  <Label>Tech Stack</Label>
                  <div className="flex gap-2">
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Add technology..."
                      onKeyDown={(e) => e.key === "Enter" && (
                        e.preventDefault(),
                        addTech()
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addTech()}
                      disabled={!techInput.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {field.state.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.state.value.map((tech) => (
                        <Badge key={tech} variant="secondary" className="gap-1">
                          {tech}
                          <button type="button" onClick={() => removeTech(tech)} className="hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              }
            </form.Field>

            <div className="flex gap-3 pt-4">
              <Button type="submit">Create Project</Button>
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
