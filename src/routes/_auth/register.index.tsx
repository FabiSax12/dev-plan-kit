import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldLabel, FieldDescription, Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { signUpWithEmailAndPassword } from '@/server-functions/auth'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/_auth/register/')({
    component: RouteComponent,
})

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
})

function RouteComponent() {
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validators: {
            onChange: formSchema
        },
        onSubmit: async ({ value }) => {
            if (value.password !== value.confirmPassword) {
                form.setErrorMap({
                    onSubmit: {
                        fields: {
                            confirmPassword: "Passwords do not match",
                        }
                    }
                });
                return;
            }

            const signUpResponse = await signUpWithEmailAndPassword({
                data: {
                    email: value.email,
                    password: value.password,
                    callbackUrl: `${window.location.origin}/callback`,
                }
            });

            if (signUpResponse.user) {
                navigate({ to: "/login" })
            }
        },
    });

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
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to create your account
                    </p>
                </div>

                <form.Field name='email'>
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
                            {/* <FieldDescription>
                                We&apos;ll use this to contact you. We will not share your
                                email with anyone else.
                            </FieldDescription> */}
                        </Field>
                    }}
                </form.Field>

                <Field>
                    <Field className="grid grid-cols-2 gap-4">
                        <form.Field name='password'>
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                                return <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        type='password'
                                        required
                                    />
                                </Field>
                            }}
                        </form.Field>
                        <form.Field name='confirmPassword'>
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                                return <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        type='password'
                                        required
                                    />
                                </Field>
                            }}
                        </form.Field>
                    </Field>
                    <FieldDescription>
                        Must be at least 8 characters long.
                    </FieldDescription>
                </Field>

                <Field>
                    <Button type="submit">Create Account</Button>
                </Field>

                <OAuthButtons />

                <FieldDescription className="text-center">
                    Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
            </FieldGroup>

        </form>
    )
}
