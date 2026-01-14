import { Field, FieldLabel } from "../ui/field"
import { Textarea } from "../ui/textarea"
import { useFieldContext } from "./context"

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
}

export const TextAreaField = ({ label, ...props }: TextAreaFieldProps) => {
    const field = useFieldContext<string | number | string[] | undefined>();

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                {...props}
            />
        </Field>
    )
}