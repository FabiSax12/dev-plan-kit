import { signInWithEmailAndPassword } from '@/server-functions/auth';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import {
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import z from 'zod';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { useAppForm } from '@/components/custom-form';

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
})

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

function RouteComponent() {
  const router = useRouter();

  const form = useAppForm({
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
        // TODO: Show error some how
        // formApi.setErrorMap({
        //   onSubmit: { fields: { email: "Invalid email or password" } }
        // });
      }
    }
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

        <form.AppField name="email">
          {(field) => <field.InputField
            type="email"
            placeholder="m@example.com"
            required
            label='Email'
          />}
        </form.AppField>


        <form.AppField name='password'>
          {(field) => <field.InputField
            type="password"
            required
            label='Password'
          />}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton>
            Login
          </form.SubmitButton>
        </form.AppForm>

        <OAuthButtons />

        <FieldDescription className="text-center">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}


