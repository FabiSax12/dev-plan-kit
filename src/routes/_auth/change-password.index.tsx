import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { changePassword, exchangeCodeForSession } from '@/server-functions/auth'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/_auth/change-password/')({
  component: RouteComponent,
  validateSearch: (search) => z.object({
    code: z.string()
  }).parse(search),
  beforeLoad: async (context) => {
    const { code } = context.search;

    if (!code) {
      throw new Error("Invalid or missing password reset code.");
    }

    const session = await exchangeCodeForSession({ data: { code } })

    if (!session.user) {
      throw new Error("Failed to exchange code for session.");
    }
  }
})

function RouteComponent() {
  const navigate = Route.useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await changePassword({
      data: { password }
    })

    if (response.user) {
      alert("Password changed successfully");
      navigate({ to: "/dashboard" })
    }
  }

  return <div>
    <form onSubmit={handleSubmit}>
      <Field>
        <FieldLabel>New Password</FieldLabel>
        <Input name="password" type="password" required />
      </Field>
      <Field>
        <FieldLabel>Confirm Password</FieldLabel>
        <Input name="confirmPassword" type="password" required />
      </Field>
      <Button type="submit">Change Password</Button>
    </form>
  </div>
}
