import { signInWithEmailAndPassword } from '@/server-functions/auth';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
})

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

function RouteComponent() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: formSchema
    },
    onSubmit: async ({ value }) => {
      try {
        const signInResponse = await signInWithEmailAndPassword({
          data: {
            email: value.email,
            password: value.password,
          }
        })

        if (signInResponse.user) {
          router.navigate({ to: '/' });
        }
      } catch (error) {
        form.setFieldMeta('email', (prev) => ({
          ...prev,
          errors: [error instanceof Error ? error.message : 'Authentication failed']
        }));
      }
    },
  })

  return (
    <form
      id={form.formId}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="p-6 md:p-8"
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground text-balance">
            Login to your DevPlanKit account
          </p>
        </div>

        <form.Field name="email">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                type="email"
                placeholder="m@example.com"
                required
              />
              <form.Subscribe
                selector={({ fieldMeta }) => fieldMeta.email?.errors}
                children={(errors) => errors && errors.length > 0 && (
                  <FieldDescription className="text-destructive">
                    {errors[0].message}
                  </FieldDescription>
                )}
              />
            </Field>
          }}
        </form.Field>


        <form.Field name='password'>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return <Field data-invalid={isInvalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Link
                  to="/reset-password"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                type="password"
                required
              />
            </Field>
          }}
        </form.Field>

        <Field>
          <Button type="submit" form={form.formId}>Login</Button>
        </Field>

        <OAuthButtons />

        <FieldDescription className="text-center">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}


