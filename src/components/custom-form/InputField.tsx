import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useFieldContext } from "./context";
import { FieldErrors } from "./FIeldErrors";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const InputField = ({ label, ...props }: InputFieldProps) => {
    const field = useFieldContext<string>();

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return <Field data-invalid={isInvalid}>
        <FieldLabel
            htmlFor={field.name}
        >
            {label}
        </FieldLabel>
        <Input
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            aria-invalid={isInvalid}
            {...props}
        />
        <FieldErrors meta={field.state.meta} />
    </Field>
};