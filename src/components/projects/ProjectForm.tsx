import { useState, type ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppForm } from '@/components/custom-form'
import { FieldGroup, FieldLabel } from '@/components/ui/field'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'node_modules/@tanstack/react-router/dist/esm/useRouter'
import type { ProjectStatus, ProjectType } from '@/domain/Project'

export type ProjectFormValues = {
  name: string
  description: string
  project_type: ProjectType
  status: ProjectStatus
  production_url: string
  repository_url: string
  tech_stack: string[]
  extra_urls: { name: string; url: string }[]
}

export type ProjectFormMode = 'create' | 'edit'

export const defaultFormValues: ProjectFormValues = {
  name: '',
  description: '',
  project_type: 'personal',
  status: 'planning',
  production_url: '',
  repository_url: '',
  tech_stack: [],
  extra_urls: [],
}

type ProjectFormProps = {
  // children: ReactNode
  mode: ProjectFormMode
  initialData?: Partial<ProjectFormValues>
  onSubmit: (values: ProjectFormValues) => Promise<void>
  isSubmitting?: boolean
  className?: string

  description?: ReactNode
  onCancel?: () => void
}

export const ProjectForm = ({
  // children,
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
  className,

  description,
  onCancel,
}: ProjectFormProps) => {
  const router = useRouter()
  const [techInput, setTechInput] = useState('')
  const [extraUrl, setExtraUrl] = useState({ name: '', url: '' })

  const form = useAppForm({
    defaultValues: {
      ...defaultFormValues,
      ...initialData,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  const addTech = () => {
    const currentStack = form.getFieldValue('tech_stack')
    const trimmedInput = techInput.trim()

    if (trimmedInput && !currentStack.includes(trimmedInput)) {
      form.setFieldValue('tech_stack', [...currentStack, trimmedInput])
    }
    setTechInput('')
  }

  const addExtraUrl = () => {
    const currentUrls = form.getFieldValue('extra_urls')
    const trimmedName = extraUrl.name.trim()
    const trimmedUrl = extraUrl.url.trim()

    if (trimmedName && trimmedUrl && !currentUrls.find((u) => u.url === trimmedUrl)) {
      form.setFieldValue('extra_urls', [...currentUrls, { name: trimmedName, url: trimmedUrl }])
      setExtraUrl({ name: '', url: '' })
    }
  }

  const removeTech = (tech: string) => {
    const currentStack = form.getFieldValue('tech_stack')
    form.setFieldValue(
      'tech_stack',
      currentStack.filter((t) => t !== tech)
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTech()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.history.back()
    }
  }

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <form
          id={form.formId}
          onSubmit={(e) => {
            console.log("Submiting")
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >

          <CardHeader className="px-0 pt-0">
            <CardTitle>{mode === 'create' ? 'Create New Project' : 'Edit Project'}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <form.AppField name='name'>
            {(field) => (
              <field.InputField
                label='Project Name'
                placeholder="Enter project name"
                required
              />
            )}
          </form.AppField>
          <form.AppField name="description">
            {(field) => (
              <field.TextAreaField
                label="Description"
                placeholder="Enter project description"
                rows={3}
              />
            )}
          </form.AppField>
          <form.AppField name='project_type'>
            {(field) => (
              <field.RadioButtonField
                label="Project Type"
                options={[
                  { value: 'personal', label: 'Personal' },
                  { value: 'work', label: 'Work' },
                ]}
              />
            )}
          </form.AppField>
          <form.AppField name='status'>
            {(field) => (
              <field.SelectField
                options={[
                  { value: 'planning', label: 'Planning' },
                  { value: 'in_development', label: 'In Development' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'on_hold', label: 'On Hold' },
                ]}
                label="Status"
                placeholder="Select status"
              />
            )}
          </form.AppField>
          <form.AppField name='production_url'>
            {(field) => (
              <field.InputField
                label="Project URL"
                type="url"
                placeholder="https://myproject.com"
              />
            )}
          </form.AppField>
          <form.AppField name='repository_url'>
            {(field) => (
              <field.InputField
                label="Repository URL"
                placeholder="https://github.com/username/repository"
                type="url"
              />
            )}
          </form.AppField>
          <form.AppField name='extra_urls'>
            {(field) => (
              <FieldGroup>
                <FieldLabel>Extra URLs</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    className='flex-1'
                    value={extraUrl.name}
                    onChange={(e) => setExtraUrl({ ...extraUrl, name: e.target.value })}
                    placeholder="Figma, Repo, Docs..."
                  />
                  <Input
                    className='flex-2'
                    value={extraUrl.url}
                    onChange={(e) => setExtraUrl({ ...extraUrl, url: e.target.value })}
                    placeholder="https://..."
                    type='url'
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addExtraUrl}
                    disabled={!extraUrl.name.trim() || !extraUrl.url.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>


                {field.state.value.length > 0 && (
                  <div className="gap-2">
                    {field.state.value.map(({ name, url }) => (
                      <p key={url}>{name}: {url}</p>
                    ))}
                  </div>
                )}
              </FieldGroup>
            )}
          </form.AppField>

          <form.AppField name='tech_stack'>
            {(field) => (
              <FieldGroup>
                <Label>Tech Stack</Label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Add technology..."
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTech}
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
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </FieldGroup>
            )}
          </form.AppField>

          <div className='flex gap-3 pt-4'>
            <form.AppForm>
              <form.SubmitButton>
                {isSubmitting
                  ? 'Creating...'
                  : mode === 'create' ? 'Create Project' : 'Save Changes'
                }
              </form.SubmitButton>
            </form.AppForm>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Compound Components Example (Commented Out)
// return (
//   <ProjectFormContext.Provider
//     value={{
//       form,
//       mode,
//       isSubmitting,
//       techInput,
//       setTechInput,
//       addTech,
//       removeTech,
//     }}
//   >
//     <Card className={className}>
//       <CardContent className="pt-6">
//         <form
//           onSubmit={(e) => {
//             e.preventDefault()
//             e.stopPropagation()
//             form.handleSubmit()
//           }}
//           className="space-y-6"
//         >
//           {children}
//         </form>
//       </CardContent>
//     </Card>
//   </ProjectFormContext.Provider>
// )