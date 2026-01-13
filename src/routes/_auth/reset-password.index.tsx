import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { resetPassword } from '@/server-functions/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/reset-password/')({
    component: RouteComponent,
})

function RouteComponent() {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;

        await resetPassword({
            data: {
                email,
                redirectTo: `${window.location.origin}/change-password/`,
            }
        })
    }

    return <div>
        <form onSubmit={handleSubmit}>
            <Field>
                <FieldLabel>Email</FieldLabel>
                <Input name="email" type="email" required />
            </Field>
            <Button type="submit">Reset Password</Button>
        </form>
    </div>
}
